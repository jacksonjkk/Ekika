import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import {
  createAccessToken,
  createOpaqueToken,
  hashOpaqueToken,
  verifyAccessToken,
  hashPassword,
  verifyPassword,
  verifyWebhookSignature,
} from "./security.js";
import { createPaymentSession } from "./payment-provider.js";

const bookingStatuses = new Set(["pending", "confirmed", "cancelled", "completed"]);
const paymentStatuses = new Set(["unpaid", "pending", "paid", "failed", "refunded"]);
const inquiryStatuses = new Set(["new", "read", "resolved"]);
const paymentMethods = new Set(["mobile-money", "card", "bank"]);

export function createApp({ supabase, appConfig = config, authProvider } = {}) {
  if (!supabase) throw new Error("createApp requires a Supabase client");
  const limiter = createRateLimiter();

  return async function app(request, response) {
    const requestId = randomUUID();
    response.setHeader("X-Request-Id", requestId);
    setSecurityHeaders(response);

    try {
      const url = new URL(request.url, "http://localhost");
      if (!setCors(request, response, appConfig.frontendOrigins)) return;
      if (request.method === "OPTIONS") return sendEmpty(response, 204);

      const route = matchRoute(request.method, url.pathname);
      if (!route) return sendJson(response, 404, { error: "Route not found", requestId });

      if (route.rateLimit && !limiter.allow(clientKey(request, route.rateLimit), route.rateLimit)) {
        return sendJson(response, 429, { error: "Too many requests. Please try again shortly.", requestId });
      }

      const auth = route.admin ? authenticate(request, appConfig.jwtSecret) : null;
      if (route.admin && !auth) return sendJson(response, 401, { error: "Admin authentication required", requestId });

      const bodyData = route.body ? await readJsonBody(request, route.maxBodyBytes) : { body: null, rawBody: "" };
      const result = await route.handler({
        auth,
        authProvider,
        body: bodyData.body,
        rawBody: bodyData.rawBody,
        supabase,
        params: route.params,
        query: url.searchParams,
        request,
        appConfig,
      });

      for (const [name, value] of Object.entries(result?.headers ?? {})) response.setHeader(name, value);
      if (result?.buffer) {
        response.writeHead(result.status ?? 200, {
          "Content-Type": result.contentType,
          "Content-Length": result.buffer.length,
          "Cache-Control": "public, max-age=31536000, immutable",
        });
        response.end(result.buffer);
        return;
      }
      if (result?.empty) return sendEmpty(response, result.status ?? 204);
      return sendJson(response, result?.status ?? 200, result?.data ?? result ?? {});
    } catch (error) {
      const status = Number(error.statusCode) || 500;
      if (status >= 500) console.error(`[${requestId}]`, error);
      return sendJson(response, status, {
        error: status >= 500 && !error.expose ? "Internal server error" : error.message,
        details: error.details,
        requestId,
      });
    }
  };
}

function matchRoute(method, pathname) {
  const routes = [
    route("GET", /^\/api\/health$/, health),
    route("GET", /^\/api\/site$/, getSite),
    route("GET", /^\/api\/experiences$/, listExperiences),
    route("GET", /^\/api\/experiences\/([^/]+)$/, getExperience, ["id"]),
    route("GET", /^\/api\/gallery$/, listGallery),
    route("GET", /^\/api\/uploads\/([^/]+)$/, getUpload, ["filename"]),
    route("POST", /^\/api\/contact$/, createInquiry, [], { body: true, rateLimit: "public-write" }),
    route("POST", /^\/api\/bookings$/, createBooking, [], { body: true, rateLimit: "public-write" }),
    route("POST", /^\/api\/customer\/register$/, registerCustomer, [], { body: true, rateLimit: "public-write" }),
    route("POST", /^\/api\/customer\/login$/, loginCustomer, [], { body: true, rateLimit: "login" }),
    route("POST", /^\/api\/customer\/logout$/, logoutCustomer, [], { rateLimit: "portal" }),
    route("GET", /^\/api\/customer\/profile$/, getCustomerProfile, [], { rateLimit: "portal" }),
    route("GET", /^\/api\/customer\/bookings$/, getCustomerBookings, [], { rateLimit: "portal" }),
    route("POST", /^\/api\/portal-auth\/request-otp$/, requestPortalOtp, [], { body: true, rateLimit: "otp-request" }),
    route("POST", /^\/api\/portal-auth\/verify-otp$/, verifyPortalOtp, [], { body: true, rateLimit: "otp-verify" }),
    route("GET", /^\/api\/customer\/portal$/, getCustomerPortal, [], { rateLimit: "portal" }),
    route("GET", /^\/api\/portal\/([^/]+)$/, getPortalBooking, ["token"], { rateLimit: "portal" }),
    route("POST", /^\/api\/portal\/([^/]+)\/payments$/, createPortalPayment, ["token"], { body: true, rateLimit: "payment" }),
    route("POST", /^\/api\/webhooks\/payments\/([^/]+)$/, paymentWebhook, ["provider"], { body: true }),
    route("POST", /^\/api\/admin\/login$/, adminLogin, [], { body: true, rateLimit: "login" }),
    route("GET", /^\/api\/admin\/site$/, getSite, [], { admin: true }),
    route("PUT", /^\/api\/admin\/site$/, updateSite, [], { admin: true, body: true }),
    route("GET", /^\/api\/admin\/experiences$/, adminListExperiences, [], { admin: true }),
    route("POST", /^\/api\/admin\/experiences$/, createExperience, [], { admin: true, body: true }),
    route("PUT", /^\/api\/admin\/experiences\/([^/]+)$/, updateExperience, ["id"], { admin: true, body: true }),
    route("DELETE", /^\/api\/admin\/experiences\/([^/]+)$/, deleteExperience, ["id"], { admin: true }),
    route("GET", /^\/api\/admin\/bookings$/, adminListBookings, [], { admin: true }),
    route("GET", /^\/api\/admin\/bookings\/([^/]+)$/, adminGetBooking, ["id"], { admin: true }),
    route("PATCH", /^\/api\/admin\/bookings\/([^/]+)$/, updateBooking, ["id"], { admin: true, body: true }),
    route("POST", /^\/api\/admin\/bookings\/([^/]+)\/portal-token$/, rotatePortalToken, ["id"], { admin: true }),
    route("GET", /^\/api\/admin\/gallery$/, adminListGallery, [], { admin: true }),
    route("POST", /^\/api\/admin\/gallery$/, createGalleryItem, [], { admin: true, body: true }),
    route("PUT", /^\/api\/admin\/gallery\/([^/]+)$/, updateGalleryItem, ["id"], { admin: true, body: true }),
    route("DELETE", /^\/api\/admin\/gallery\/([^/]+)$/, deleteGalleryItem, ["id"], { admin: true }),
    route("POST", /^\/api\/admin\/uploads$/, createUpload, [], { admin: true, body: true, maxBodyBytes: 22_000_000 }),
    route("GET", /^\/api\/admin\/inquiries$/, listInquiries, [], { admin: true }),
    route("PATCH", /^\/api\/admin\/inquiries\/([^/]+)$/, updateInquiry, ["id"], { admin: true, body: true }),
  ];

  for (const candidate of routes) {
    if (candidate.method !== method) continue;
    const match = pathname.match(candidate.pattern);
    if (!match) continue;
    candidate.params = Object.fromEntries(candidate.paramNames.map((name, index) => [name, decodeURIComponent(match[index + 1])]));
    return candidate;
  }
  return null;
}

function route(method, pattern, handler, paramNames = [], options = {}) {
  return { method, pattern, handler, paramNames, ...options };
}

function health() {
  return { data: { status: "ok", service: "ekika-backend", time: new Date().toISOString() } };
}

async function getSite({ supabase }) {
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (!data) return { data: { site: null } };
  return { data: { site: serializeSite(data) } };
}

async function listExperiences({ supabase }) {
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_active", 1)
    .order("sort_order")
    .order("created_at");
  return { data: { experiences: (data ?? []).map(serializeExperience) } };
}

async function adminListExperiences({ supabase }) {
  const { data } = await supabase.from("experiences").select("*").order("sort_order").order("created_at");
  return { data: { experiences: (data ?? []).map(serializeExperience) } };
}

async function getExperience({ supabase, params }) {
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!data || !data.is_active) throw httpError(404, "Experience not found");
  return { data: { experience: serializeExperience(data) } };
}

async function listGallery({ supabase }) {
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", 1)
    .order("sort_order")
    .order("created_at");
  return { data: { gallery: (data ?? []).map(serializeGallery) } };
}

async function adminListGallery({ supabase }) {
  const { data } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at");
  return { data: { gallery: (data ?? []).map(serializeGallery) } };
}

function getUpload({ params, appConfig }) {
  if (!/^[a-f0-9-]+\.(?:jpg|png|webp)$/.test(params.filename)) throw httpError(404, "Image not found");
  const filename = path.join(appConfig.backendRoot ?? config.backendRoot, "uploads", params.filename);
  if (!fs.existsSync(filename)) throw httpError(404, "Image not found");
  const extension = path.extname(filename);
  const contentTypes = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  return { buffer: fs.readFileSync(filename), contentType: contentTypes[extension] };
}

function createUpload({ body, appConfig }) {
  const mimeType = text(body?.mimeType, "MIME type", 50);
  const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const extension = extensions[mimeType];
  if (!extension) throw httpError(400, "Only JPEG, PNG, and WebP images are supported.");
  if (typeof body?.contentBase64 !== "string") throw httpError(400, "Image content is required");
  const buffer = Buffer.from(body.contentBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
  if (!buffer.length || buffer.length > 15_000_000 || !matchesImageSignature(buffer, mimeType)) {
    throw httpError(400, "Image data is invalid or exceeds 15 MB.");
  }
  const uploadDirectory = path.join(appConfig.backendRoot ?? config.backendRoot, "uploads");
  fs.mkdirSync(uploadDirectory, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  fs.writeFileSync(path.join(uploadDirectory, filename), buffer, { flag: "wx" });
  return { status: 201, data: { imageUrl: `/api/uploads/${filename}`, filename } };
}

async function createInquiry({ supabase, body }) {
  const input = validateInquiry(body);
  const id = randomUUID();
  const now = new Date().toISOString();
  await supabase.from("inquiries").insert({
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    status: "new",
    created_at: now,
    updated_at: now,
  });
  return { status: 201, data: { inquiry: { id, status: "new", createdAt: now } } };
}

async function createBooking({ supabase, body, appConfig, request }) {
  const customerSession = await findCustomerSession(supabase, request);
  const input = validateBooking(body);

  let experience;
  if (input.experienceId) {
    const { data } = await supabase
      .from("experiences")
      .select("*")
      .eq("id", input.experienceId)
      .eq("is_active", 1)
      .single();
    if (!data) throw httpError(400, "Please select an available experience.");
    experience = data;
  } else {
    experience = { id: null, title: input.experienceTitle, price_cents: 0, image_url: "", currency: "USD" };
  }

  const totalCents = experience.price_cents * input.guestCount;
  const amountDueCents =
    input.paymentChoice === "full"
      ? totalCents
      : Math.ceil(totalCents * (appConfig.depositPercent / 100));
  const id = randomUUID();
  const portalToken = createOpaqueToken();
  const now = new Date().toISOString();
  const customerId = customerSession ? customerSession.id : null;

  await supabase.from("bookings").insert({
    id,
    portal_token_hash: hashOpaqueToken(portalToken),
    customer_id: customerId,
    experience_id: experience.id,
    experience_title: experience.title,
    unit_price_cents: experience.price_cents,
    experience_image: experience.image_url,
    guest_name: input.guestName,
    email: input.email,
    phone: input.phone,
    guest_count: input.guestCount,
    preferred_date: input.preferredDate,
    special_requests: input.specialRequests,
    payment_choice: input.paymentChoice,
    booking_status: "pending",
    payment_status: "unpaid",
    total_cents: totalCents,
    amount_due_cents: amountDueCents,
    currency: experience.currency,
    created_at: now,
    updated_at: now,
  });

  const { data: booking } = await supabase.from("bookings").select("*").eq("id", id).single();
  return {
    status: 201,
    data: {
      booking: { ...serializeBooking(booking), portalToken },
      portalPath: `/booking-portal/${portalToken}`,
    },
  };
}

async function getPortalBooking({ supabase, params }) {
  const booking = await findBookingByPortalToken(supabase, params.token);
  if (!booking) throw httpError(404, "Booking portal not found");
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", booking.id)
    .order("created_at", { ascending: false });
  return { data: { booking: serializeBooking(booking), payments: (payments ?? []).map(serializePayment) } };
}

async function requestPortalOtp({ supabase, body, authProvider }) {
  if (!authProvider?.configured) throw httpError(503, "Email verification is not configured yet.");
  const email = emailValue(body?.email);
  const bookingReference = text(body?.bookingReference, "Booking reference", 100);
  const { data: booking } = await supabase
    .from("bookings")
    .select("id")
    .eq("id", bookingReference)
    .eq("email", email)
    .neq("booking_status", "cancelled")
    .single();
  if (booking) await authProvider.requestOtp(email);
  return {
    status: 202,
    data: { message: "If the booking details match, a verification code has been sent." },
  };
}

async function verifyPortalOtp({ supabase, body, authProvider, appConfig }) {
  if (!authProvider?.configured) throw httpError(503, "Email verification is not configured yet.");
  const email = emailValue(body?.email);
  const bookingReference = text(body?.bookingReference, "Booking reference", 100);
  const otp = text(body?.otp, "Verification code", 6);
  if (!/^\d{6}$/.test(otp)) throw httpError(400, "Verification code must contain six digits.");

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingReference)
    .eq("email", email)
    .neq("booking_status", "cancelled")
    .single();
  if (!booking) throw httpError(401, "Invalid booking details or verification code.");

  await authProvider.verifyOtp(email, otp);
  const sessionToken = createOpaqueToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + appConfig.portalSessionTtlSeconds * 1000);

  await supabase
    .from("portal_sessions")
    .update({ revoked_at: now.toISOString() })
    .eq("booking_id", booking.id)
    .is("revoked_at", null);

  await supabase.from("portal_sessions").insert({
    id: randomUUID(),
    booking_id: booking.id,
    token_hash: hashOpaqueToken(sessionToken),
    expires_at: expiresAt.toISOString(),
    revoked_at: null,
    created_at: now.toISOString(),
    last_used_at: now.toISOString(),
  });

  return {
    data: { booking: serializeBooking(booking), expiresAt: expiresAt.toISOString() },
    headers: {
      "Set-Cookie": portalSessionCookie(sessionToken, appConfig.portalSessionTtlSeconds, appConfig.nodeEnv === "production"),
    },
  };
}

async function getCustomerPortal({ supabase, request }) {
  const session = await findPortalSession(supabase, request);
  if (!session) throw httpError(401, "Your booking session has expired. Please sign in again.");
  await supabase
    .from("portal_sessions")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", session.session_id);
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", session.id)
    .order("created_at", { ascending: false });
  return { data: { booking: serializeBooking(session), payments: (payments ?? []).map(serializePayment) } };
}

async function registerCustomer({ supabase, body, appConfig }) {
  const name = text(body?.name, "Name", 120);
  const email = emailValue(body?.email);
  const password = text(body?.password, "Password", 200);
  const phone = optionalText(body?.phone, 40);

  if (password.length < 8) throw httpError(400, "Password must be at least 8 characters long");

  const { data: existing, error: lookupError } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (lookupError) throw databaseError("Could not check customer account", lookupError);
  if (existing) throw httpError(409, "An account with this email already exists");

  const id = randomUUID();
  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();

  const { error: customerError } = await supabase.from("customers").insert({
    id,
    name,
    email,
    password_hash: passwordHash,
    phone,
    created_at: now,
    updated_at: now,
  });
  if (customerError) throw databaseError("Could not create customer account", customerError);

  const sessionToken = createOpaqueToken();
  const expiresAt = new Date(Date.now() + appConfig.portalSessionTtlSeconds * 1000);
  const { error: sessionError } = await supabase.from("customer_sessions").insert({
    id: randomUUID(),
    customer_id: id,
    token_hash: hashOpaqueToken(sessionToken),
    expires_at: expiresAt.toISOString(),
    revoked_at: null,
    created_at: now,
    last_used_at: now,
  });
  if (sessionError) {
    await supabase.from("customers").delete().eq("id", id);
    throw databaseError("Could not start customer session", sessionError);
  }

  return {
    status: 201,
    data: { customer: { id, name, email, phone } },
    headers: {
      "Set-Cookie": customerSessionCookie(sessionToken, appConfig.portalSessionTtlSeconds, appConfig.nodeEnv === "production"),
    },
  };
}

async function loginCustomer({ supabase, body, appConfig }) {
  const email = emailValue(body?.email);
  const password = text(body?.password, "Password", 200);

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (customerError) throw databaseError("Could not retrieve customer account", customerError);
  if (!customer || !verifyPassword(password, customer.password_hash)) {
    throw httpError(401, "Invalid email or password");
  }

  const sessionToken = createOpaqueToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + appConfig.portalSessionTtlSeconds * 1000);

  const { error: sessionError } = await supabase.from("customer_sessions").insert({
    id: randomUUID(),
    customer_id: customer.id,
    token_hash: hashOpaqueToken(sessionToken),
    expires_at: expiresAt.toISOString(),
    revoked_at: null,
    created_at: now.toISOString(),
    last_used_at: now.toISOString(),
  });
  if (sessionError) throw databaseError("Could not start customer session", sessionError);

  return {
    data: { customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } },
    headers: {
      "Set-Cookie": customerSessionCookie(sessionToken, appConfig.portalSessionTtlSeconds, appConfig.nodeEnv === "production"),
    },
  };
}

async function logoutCustomer({ supabase, request, appConfig }) {
  const portalToken = readCookie(request, "ekika_portal_session");
  if (portalToken) {
    await supabase
      .from("portal_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", hashOpaqueToken(portalToken))
      .is("revoked_at", null);
  }
  const customerToken = readCookie(request, "ekika_customer_session");
  if (customerToken) {
    await supabase
      .from("customer_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", hashOpaqueToken(customerToken))
      .is("revoked_at", null);
  }
  return {
    status: 204,
    empty: true,
    headers: {
      "Set-Cookie": [
        portalSessionCookie("", 0, appConfig.nodeEnv === "production"),
        customerSessionCookie("", 0, appConfig.nodeEnv === "production"),
      ],
    },
  };
}

async function getCustomerProfile({ supabase, request }) {
  const session = await findCustomerSession(supabase, request);
  if (!session) throw httpError(401, "Please log in to view your profile.");
  return { data: { customer: { id: session.id, name: session.name, email: session.email, phone: session.phone } } };
}

async function getCustomerBookings({ supabase, request }) {
  const session = await findCustomerSession(supabase, request);
  if (!session) throw httpError(401, "Please log in to view your bookings.");

  const { data: rows } = await supabase
    .from("bookings")
    .select("*")
    .or(`customer_id.eq.${session.id},email.eq.${session.email.toLowerCase()}`)
    .order("preferred_date", { ascending: false })
    .order("created_at", { ascending: false });

  return { data: { bookings: (rows ?? []).map(serializeBooking) } };
}

async function createPortalPayment({ supabase, params, body, request, appConfig }) {
  const booking = await findBookingByPortalToken(supabase, params.token);
  if (!booking) throw httpError(404, "Booking portal not found");
  if (booking.booking_status === "cancelled") throw httpError(409, "Cancelled bookings cannot be paid.");
  if (booking.payment_status === "paid") throw httpError(409, "This booking is already paid.");

  const method = text(body?.method, "Payment method", 30);
  if (!paymentMethods.has(method)) throw httpError(400, "Unsupported payment method");
  const idempotencyKey = request.headers["idempotency-key"] || randomUUID();

  const { data: existing } = await supabase
    .from("payments")
    .select("*")
    .eq("idempotency_key", idempotencyKey)
    .single();
  if (existing) return { data: { payment: serializePayment(existing), reused: true } };

  const session = createPaymentSession({
    provider: appConfig.paymentProvider,
    method,
    amountCents: booking.amount_due_cents,
    currency: booking.currency,
    simulateResult: appConfig.nodeEnv === "production" ? undefined : body?.simulateResult,
  });
  const id = randomUUID();
  const now = new Date().toISOString();

  await supabase.from("payments").insert({
    id,
    booking_id: booking.id,
    provider: session.provider,
    method,
    amount_cents: booking.amount_due_cents,
    currency: booking.currency,
    status: session.status,
    provider_reference: session.providerReference,
    idempotency_key: idempotencyKey,
    metadata_json: JSON.stringify(session),
    created_at: now,
    updated_at: now,
  });

  await applyPaymentStatus(supabase, booking.id, session.status, now);
  const { data: payment } = await supabase.from("payments").select("*").eq("id", id).single();
  return {
    status: 201,
    data: {
      payment: serializePayment(payment),
      checkoutUrl: session.checkoutUrl ?? null,
      instructions: session.instructions ?? null,
    },
  };
}

async function paymentWebhook({ supabase, params, body, rawBody, request, appConfig }) {
  if (!verifyWebhookSignature(rawBody, request.headers["x-ekika-signature"], appConfig.paymentWebhookSecret)) {
    throw httpError(401, "Invalid webhook signature");
  }
  const reference = text(body?.providerReference, "Provider reference", 200);
  const status = text(body?.status, "Payment status", 20);
  if (!new Set(["pending", "paid", "failed", "refunded"]).has(status)) throw httpError(400, "Invalid payment status");

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("provider_reference", reference)
    .eq("provider", params.provider)
    .single();
  if (!payment) throw httpError(404, "Payment not found");

  const now = new Date().toISOString();
  await supabase.from("payments").update({ status, updated_at: now }).eq("id", payment.id);
  await applyPaymentStatus(supabase, payment.booking_id, status, now);
  return { data: { received: true } };
}

async function adminLogin({ supabase, body, appConfig }) {
  const email = emailValue(body?.email);
  const password = text(body?.password, "Password", 200);
  const { data: admin } = await supabase.from("admins").select("*").eq("email", email).single();
  if (!admin || !verifyPassword(password, admin.password_hash)) throw httpError(401, "Invalid email or password");
  const token = createAccessToken(
    { sub: admin.id, email: admin.email, role: "admin" },
    appConfig.jwtSecret,
    appConfig.jwtTtlSeconds
  );
  return { data: { token, expiresIn: appConfig.jwtTtlSeconds, admin: { id: admin.id, email: admin.email } } };
}

async function updateSite({ supabase, body, auth }) {
  const site = validateSite(body?.site ?? body);
  const now = new Date().toISOString();
  await supabase.from("site_settings").update({
    name: site.name,
    short_name: site.shortName,
    email: site.email,
    phone_display: site.phoneDisplay,
    phone_href: site.phoneHref,
    whatsapp_url: site.whatsappUrl,
    address_json: JSON.stringify(site.address),
    location_label: site.locationLabel,
    updated_at: now,
  }).eq("id", 1);
  await audit(supabase, auth.sub, "update", "site", "1");
  return getSite({ supabase });
}

async function createExperience({ supabase, body, auth }) {
  const input = validateExperience(body?.experience ?? body);
  const id = input.id || randomUUID();
  const { data: exists } = await supabase.from("experiences").select("id").eq("id", id).single();
  if (exists) throw httpError(409, "Experience ID already exists");

  const now = new Date().toISOString();
  const { data: maxRow } = await supabase
    .from("experiences")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const order = maxRow ? maxRow.sort_order + 1 : 0;

  await supabase.from("experiences").insert({
    id,
    title: input.title,
    description: input.description,
    price_cents: input.priceCents,
    currency: input.currency,
    duration: input.duration,
    image_url: input.image,
    tag: input.tag,
    included_json: JSON.stringify(input.included),
    sort_order: input.sortOrder ?? order,
    is_active: input.isActive ? 1 : 0,
    created_at: now,
    updated_at: now,
  });

  await audit(supabase, auth.sub, "create", "experience", id);
  const { data: exp } = await supabase.from("experiences").select("*").eq("id", id).single();
  return { status: 201, data: { experience: serializeExperience(exp) } };
}

async function updateExperience({ supabase, body, params, auth }) {
  const { data: existing } = await supabase.from("experiences").select("id").eq("id", params.id).single();
  if (!existing) throw httpError(404, "Experience not found");

  const input = validateExperience(body?.experience ?? body);
  const now = new Date().toISOString();
  await supabase.from("experiences").update({
    title: input.title,
    description: input.description,
    price_cents: input.priceCents,
    currency: input.currency,
    duration: input.duration,
    image_url: input.image,
    tag: input.tag,
    included_json: JSON.stringify(input.included),
    sort_order: input.sortOrder ?? 0,
    is_active: input.isActive ? 1 : 0,
    updated_at: now,
  }).eq("id", params.id);

  await audit(supabase, auth.sub, "update", "experience", params.id);
  const { data: exp } = await supabase.from("experiences").select("*").eq("id", params.id).single();
  return { data: { experience: serializeExperience(exp) } };
}

async function deleteExperience({ supabase, params, auth }) {
  const { data } = await supabase.from("experiences").delete().eq("id", params.id).select();
  if (!data?.length) throw httpError(404, "Experience not found");
  await audit(supabase, auth.sub, "delete", "experience", params.id);
  return { status: 204, empty: true };
}

async function adminListBookings({ supabase, query }) {
  const limit = Math.min(100, Math.max(1, Number(query.get("limit")) || 50));
  const offset = Math.max(0, Number(query.get("offset")) || 0);
  const { data: rows, count } = await supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  return {
    data: {
      bookings: (rows ?? []).map(serializeBooking),
      pagination: { total: count ?? 0, limit, offset },
    },
  };
}

async function adminGetBooking({ supabase, params }) {
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", params.id).single();
  if (!booking) throw httpError(404, "Booking not found");
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", params.id)
    .order("created_at", { ascending: false });
  return { data: { booking: serializeBooking(booking), payments: (payments ?? []).map(serializePayment) } };
}

async function updateBooking({ supabase, params, body, auth, appConfig }) {
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", params.id).single();
  if (!booking) throw httpError(404, "Booking not found");

  const bookingStatus = body?.bookingStatus ?? booking.booking_status;
  const paymentStatus = body?.paymentStatus ?? booking.payment_status;
  if (!bookingStatuses.has(bookingStatus) || !paymentStatuses.has(paymentStatus)) {
    throw httpError(400, "Invalid booking or payment status");
  }

  const guestName = body?.guestName === undefined ? booking.guest_name : text(body.guestName, "Guest name", 120);
  const email = body?.email === undefined ? booking.email : emailValue(body.email);
  const phone = body?.phone === undefined ? booking.phone : text(body.phone, "Phone", 40);
  const specialRequests = body?.specialRequests === undefined
    ? booking.special_requests
    : optionalText(body.specialRequests, 2000);
  const preferredDate = body?.preferredDate === undefined
    ? booking.preferred_date
    : text(body.preferredDate, "Preferred date", 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) throw httpError(400, "Preferred date is invalid");

  const guestCount = body?.guestCount === undefined ? booking.guest_count : Number(body.guestCount);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100) {
    throw httpError(400, "Guest count must be between 1 and 100");
  }
  if (guestCount !== booking.guest_count && booking.payment_status === "paid") {
    throw httpError(409, "Guest count cannot be changed after payment. Refund or contact the customer first.");
  }

  const totalCents = booking.unit_price_cents * guestCount;
  const amountDueCents = booking.payment_choice === "full"
    ? totalCents
    : Math.ceil(totalCents * (appConfig.depositPercent / 100));

  const now = new Date().toISOString();
  await supabase
    .from("bookings")
    .update({
      booking_status: bookingStatus,
      payment_status: paymentStatus,
      guest_name: guestName,
      email,
      phone,
      guest_count: guestCount,
      preferred_date: preferredDate,
      special_requests: specialRequests,
      total_cents: totalCents,
      amount_due_cents: amountDueCents,
      updated_at: now,
    })
    .eq("id", params.id);
  await audit(supabase, auth.sub, "update", "booking", params.id, {
    bookingStatus,
    paymentStatus,
    guestName,
    email,
    phone,
    guestCount,
    preferredDate,
  });
  return adminGetBooking({ supabase, params });
}

async function rotatePortalToken({ supabase, params, auth }) {
  const { data: booking } = await supabase.from("bookings").select("id").eq("id", params.id).single();
  if (!booking) throw httpError(404, "Booking not found");
  const portalToken = createOpaqueToken();
  const now = new Date().toISOString();
  await supabase
    .from("bookings")
    .update({ portal_token_hash: hashOpaqueToken(portalToken), updated_at: now })
    .eq("id", params.id);
  await audit(supabase, auth.sub, "rotate-portal-token", "booking", params.id);
  return { data: { portalToken, portalPath: `/booking-portal/${portalToken}` } };
}

async function createGalleryItem({ supabase, body, auth }) {
  const input = validateGallery(body?.item ?? body);
  const id = randomUUID();
  const now = new Date().toISOString();
  const { data: maxRow } = await supabase
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const order = maxRow ? maxRow.sort_order + 1 : 0;

  await supabase.from("gallery_items").insert({
    id,
    title: input.title,
    tag: input.tag,
    image_url: input.imageUrl,
    alt_text: input.altText,
    sort_order: input.sortOrder ?? order,
    is_active: input.isActive ? 1 : 0,
    created_at: now,
    updated_at: now,
  });

  await audit(supabase, auth.sub, "create", "gallery", id);
  const { data: item } = await supabase.from("gallery_items").select("*").eq("id", id).single();
  return { status: 201, data: { item: serializeGallery(item) } };
}

async function updateGalleryItem({ supabase, body, params, auth }) {
  const { data: existing } = await supabase.from("gallery_items").select("id").eq("id", params.id).single();
  if (!existing) throw httpError(404, "Gallery item not found");

  const input = validateGallery(body?.item ?? body);
  const now = new Date().toISOString();
  await supabase.from("gallery_items").update({
    title: input.title,
    tag: input.tag,
    image_url: input.imageUrl,
    alt_text: input.altText,
    sort_order: input.sortOrder ?? 0,
    is_active: input.isActive ? 1 : 0,
    updated_at: now,
  }).eq("id", params.id);

  await audit(supabase, auth.sub, "update", "gallery", params.id);
  const { data: item } = await supabase.from("gallery_items").select("*").eq("id", params.id).single();
  return { data: { item: serializeGallery(item) } };
}

async function deleteGalleryItem({ supabase, params, auth }) {
  const { data } = await supabase.from("gallery_items").delete().eq("id", params.id).select();
  if (!data?.length) throw httpError(404, "Gallery item not found");
  await audit(supabase, auth.sub, "delete", "gallery", params.id);
  return { status: 204, empty: true };
}

async function listInquiries({ supabase }) {
  const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  return { data: { inquiries: (data ?? []).map(serializeInquiry) } };
}

async function updateInquiry({ supabase, params, body, auth }) {
  const status = body?.status;
  if (!inquiryStatuses.has(status)) throw httpError(400, "Invalid inquiry status");
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("inquiries")
    .update({ status, updated_at: now })
    .eq("id", params.id)
    .select();
  if (!data?.length) throw httpError(404, "Inquiry not found");
  await audit(supabase, auth.sub, "update-status", "inquiry", params.id, { status });
  const { data: inquiry } = await supabase.from("inquiries").select("*").eq("id", params.id).single();
  return { data: { inquiry: serializeInquiry(inquiry) } };
}

// ── Validation ─────────────────────────────────────────────────────────────

function validateBooking(input) {
  const preferredDate = text(input?.preferredDate, "Preferred date", 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || preferredDate < new Date().toISOString().slice(0, 10)) {
    throw httpError(400, "Preferred date must be today or later.");
  }
  const guestCount = Number(input?.guestCount);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100)
    throw httpError(400, "Guest count must be between 1 and 100.");
  const paymentChoice = input?.paymentChoice;
  if (paymentChoice !== "deposit" && paymentChoice !== "full")
    throw httpError(400, "Payment choice must be deposit or full.");
  return {
    experienceId: optionalText(input?.experienceId, 100),
    experienceTitle: input?.experienceId ? "" : text(input?.experienceTitle, "Experience title", 160),
    guestName: text(input?.guestName, "Guest name", 120),
    email: emailValue(input?.email),
    phone: text(input?.phone, "Phone", 40),
    guestCount,
    preferredDate,
    specialRequests: optionalText(input?.specialRequests, 2000),
    paymentChoice,
  };
}

function validateInquiry(input) {
  return {
    name: text(input?.name, "Name", 120),
    email: emailValue(input?.email),
    phone: optionalText(input?.phone, 40),
    message: text(input?.message, "Message", 4000),
  };
}

function validateSite(input) {
  const address = Array.isArray(input?.address)
    ? input.address.map((line) => text(line, "Address line", 200))
    : [];
  return {
    name: text(input?.name, "Business name", 120),
    shortName: text(input?.shortName, "Short name", 50),
    email: emailValue(input?.email),
    phoneDisplay: text(input?.phoneDisplay, "Display phone", 50),
    phoneHref: safeUrl(input?.phoneHref, "Phone link", ["tel:"]),
    whatsappUrl: safeUrl(input?.whatsappUrl, "WhatsApp link", ["https:"]),
    address,
    locationLabel: text(input?.locationLabel, "Location", 200),
  };
}

function validateExperience(input) {
  const priceCents = Number.isInteger(input?.priceCents) ? input.priceCents : parseMoney(input?.price);
  if (!Number.isInteger(priceCents) || priceCents < 0 || priceCents > 100_000_000)
    throw httpError(400, "Price is invalid");
  return {
    id: optionalText(input?.id, 100),
    title: text(input?.title, "Title", 160),
    description: text(input?.description, "Description", 3000),
    priceCents,
    currency: optionalText(input?.currency, 3).toUpperCase() || "USD",
    duration: text(input?.duration, "Duration", 80),
    image: safeImageUrl(input?.image ?? input?.imageUrl),
    tag: optionalText(input?.tag, 80),
    included: Array.isArray(input?.included)
      ? input.included.map((item) => text(item, "Included item", 200))
      : [],
    sortOrder: Number.isInteger(input?.sortOrder) ? input.sortOrder : undefined,
    isActive: input?.isActive !== false,
  };
}

function validateGallery(input) {
  return {
    title: text(input?.title, "Title", 160),
    tag: optionalText(input?.tag, 80),
    imageUrl: safeImageUrl(input?.imageUrl),
    altText: text(input?.altText, "Alt text", 300),
    sortOrder: Number.isInteger(input?.sortOrder) ? input.sortOrder : undefined,
    isActive: input?.isActive !== false,
  };
}

// ── Serializers ────────────────────────────────────────────────────────────

function serializeSite(row) {
  return {
    name: row.name,
    shortName: row.short_name,
    email: row.email,
    phoneDisplay: row.phone_display,
    phoneHref: row.phone_href,
    whatsappUrl: row.whatsapp_url,
    address: JSON.parse(row.address_json),
    locationLabel: row.location_label,
    updatedAt: row.updated_at,
  };
}

function serializeExperience(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: formatMoney(row.price_cents, row.currency),
    priceCents: row.price_cents,
    currency: row.currency,
    duration: row.duration,
    image: row.image_url,
    tag: row.tag,
    included: JSON.parse(row.included_json),
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeBooking(row) {
  return {
    id: row.id,
    experienceId: row.experience_id,
    experienceTitle: row.experience_title,
    experiencePrice: formatMoney(row.unit_price_cents, row.currency),
    experienceImage: row.experience_image,
    guestName: row.guest_name,
    email: row.email,
    phone: row.phone,
    guestCount: row.guest_count,
    preferredDate: row.preferred_date,
    specialRequests: row.special_requests,
    paymentChoice: row.payment_choice,
    bookingStatus: row.booking_status,
    paymentStatus: row.payment_status,
    totalAmount: formatMoney(row.total_cents, row.currency),
    amountDue: formatMoney(row.amount_due_cents, row.currency),
    totalCents: row.total_cents,
    amountDueCents: row.amount_due_cents,
    currency: row.currency,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializePayment(row) {
  return {
    id: row.id,
    bookingId: row.booking_id,
    provider: row.provider,
    method: row.method,
    amount: formatMoney(row.amount_cents, row.currency),
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    providerReference: row.provider_reference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeGallery(row) {
  return {
    id: row.id,
    title: row.title,
    tag: row.tag,
    imageUrl: row.image_url,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serializeInquiry(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Database Helpers ───────────────────────────────────────────────────────

async function applyPaymentStatus(supabase, bookingId, status, now) {
  const bookingStatus = status === "paid" ? "confirmed" : "pending";
  const paymentStatus = status === "paid" ? "paid" : status === "refunded" ? "refunded" : status;
  await supabase
    .from("bookings")
    .update({ payment_status: paymentStatus, booking_status: bookingStatus, updated_at: now })
    .eq("id", bookingId);
}

async function findBookingByPortalToken(supabase, token) {
  if (!token || token.length > 200) return null;
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("portal_token_hash", hashOpaqueToken(token))
    .single();
  return data ?? null;
}

async function findPortalSession(supabase, request) {
  const token = readCookie(request, "ekika_portal_session");
  if (!token) return null;
  const { data: session } = await supabase
    .from("portal_sessions")
    .select("*")
    .eq("token_hash", hashOpaqueToken(token))
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (!session) return null;
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", session.booking_id).single();
  if (!booking) return null;
  return { ...booking, session_id: session.id };
}

async function findCustomerSession(supabase, request) {
  const token = readCookie(request, "ekika_customer_session");
  if (!token) return null;
  const { data: session } = await supabase
    .from("customer_sessions")
    .select("*")
    .eq("token_hash", hashOpaqueToken(token))
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (!session) return null;
  const { data: customer } = await supabase.from("customers").select("*").eq("id", session.customer_id).single();
  if (!customer) return null;
  return { ...customer, session_id: session.id };
}

async function audit(supabase, adminId, action, entityType, entityId, details = {}) {
  await supabase.from("audit_log").insert({
    id: randomUUID(),
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details_json: JSON.stringify(details),
    created_at: new Date().toISOString(),
  });
}

// ── Cookie / Auth Helpers ──────────────────────────────────────────────────

function readCookie(request, name) {
  const raw = request.headers.cookie ?? "";
  for (const entry of raw.split(";")) {
    const [key, ...parts] = entry.trim().split("=");
    if (key === name) return decodeURIComponent(parts.join("="));
  }
  return "";
}

function portalSessionCookie(token, maxAge, secure) {
  return [
    `ekika_portal_session=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/api/customer",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

function customerSessionCookie(token, maxAge, secure) {
  return [
    `ekika_customer_session=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

function authenticate(request, secret) {
  const value = request.headers.authorization ?? "";
  if (!value.startsWith("Bearer ")) return null;
  const payload = verifyAccessToken(value.slice(7), secret);
  return payload?.role === "admin" ? payload : null;
}

// ── String / Validation Utilities ─────────────────────────────────────────

function text(value, label, maxLength) {
  if (typeof value !== "string" || !value.trim()) throw httpError(400, `${label} is required`);
  const clean = value.trim();
  if (clean.length > maxLength) throw httpError(400, `${label} is too long`);
  return clean;
}

function optionalText(value, maxLength) {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") throw httpError(400, "Invalid text value");
  return value.trim().slice(0, maxLength);
}

function emailValue(value) {
  const email = text(value, "Email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw httpError(400, "Email is invalid");
  return email;
}

function safeUrl(value, label, protocols) {
  const raw = text(value, label, 2000);
  try {
    const url = new URL(raw);
    if (!protocols.includes(url.protocol)) throw new Error();
    return raw;
  } catch {
    throw httpError(400, `${label} is invalid`);
  }
}

function safeImageUrl(value) {
  if (typeof value === "string" && /^\/api\/uploads\/[a-f0-9-]+\.(?:jpg|png|webp)$/.test(value)) return value;
  return safeUrl(value, "Image URL", ["https:", "http:"]);
}

function matchesImageSignature(buffer, mimeType) {
  if (mimeType === "image/jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === "image/png")
    return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === "image/webp")
    return buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  return false;
}

function parseMoney(value) {
  if (typeof value !== "string") return Number.NaN;
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? Math.round(amount * 100) : Number.NaN;
}

function formatMoney(cents, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
}

function httpError(statusCode, message, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

function databaseError(message, error) {
  console.error(message, error);
  const result = httpError(500, message);
  result.expose = true;
  return result;
}

// ── HTTP Helpers ───────────────────────────────────────────────────────────

function setSecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function setCors(request, response, allowedOrigins) {
  const origin = request.headers.origin;
  if (!origin) return true;
  if (!allowedOrigins.includes(origin)) {
    sendJson(response, 403, { error: "Origin is not allowed" });
    return false;
  }
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Vary", "Origin");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, Idempotency-Key, X-Ekika-Signature"
  );
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  return true;
}

function sendJson(response, status, data) {
  if (response.writableEnded) return;
  const payload = JSON.stringify(data);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  });
  response.end(payload);
}

function sendEmpty(response, status) {
  if (response.writableEnded) return;
  response.writeHead(status);
  response.end();
}

function clientKey(request, bucket) {
  return `${bucket}:${request.socket.remoteAddress ?? "unknown"}`;
}

async function readJsonBody(request, maximumBytes = 1_000_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximumBytes) throw httpError(413, "Request body is too large");
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) return { body: {}, rawBody: "" };
  try {
    return { body: JSON.parse(rawBody), rawBody };
  } catch {
    throw httpError(400, "Request body must be valid JSON");
  }
}

function createRateLimiter() {
  const buckets = new Map();
  const settings = {
    login: [10, 15 * 60_000],
    payment: [20, 10 * 60_000],
    "public-write": [30, 10 * 60_000],
    portal: [120, 10 * 60_000],
    "otp-request": [5, 15 * 60_000],
    "otp-verify": [10, 15 * 60_000],
  };
  return {
    allow(key, type) {
      const [maximum, windowMs] = settings[type] ?? [60, 60_000];
      const now = Date.now();
      const current = buckets.get(key);
      if (!current || current.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      current.count += 1;
      return current.count <= maximum;
    },
  };
}
