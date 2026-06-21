import assert from "node:assert/strict";
import { Readable } from "node:stream";
import test from "node:test";
import { createApp } from "../src/app.js";
import { closeDatabase, openDatabase } from "../src/database.js";

const testConfig = {
  nodeEnv: "test",
  frontendOrigins: ["http://localhost:5173"],
  jwtSecret: "test-secret-that-is-long-enough-for-api-tests",
  jwtTtlSeconds: 3600,
  paymentProvider: "mock",
  paymentWebhookSecret: "test-webhook-secret",
  depositPercent: 30,
  portalSessionTtlSeconds: 3600,
};

function setup(authProvider) {
  const db = openDatabase({ databasePath: ":memory:", adminEmail: "admin@example.com", adminPassword: "strong-test-password" });
  return { db, app: createApp({ db, appConfig: testConfig, authProvider }) };
}

async function invoke(app, { method = "GET", url = "/", body, headers = {} } = {}) {
  const rawBody = body === undefined ? "" : JSON.stringify(body);
  const request = Readable.from(rawBody ? [Buffer.from(rawBody)] : []);
  request.method = method;
  request.url = url;
  request.headers = { ...(rawBody ? { "content-type": "application/json" } : {}), ...headers };
  Object.defineProperty(request, "socket", { value: { remoteAddress: "127.0.0.1" } });

  const response = {
    statusCode: 200,
    headers: {},
    writableEnded: false,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    writeHead(status, responseHeaders = {}) {
      this.statusCode = status;
      for (const [name, value] of Object.entries(responseHeaders)) this.setHeader(name, value);
    },
    end(payload = "") {
      this.writableEnded = true;
      this.payload = String(payload);
    },
  };

  await app(request, response);
  return {
    status: response.statusCode,
    headers: response.headers,
    body: response.payload ? JSON.parse(response.payload) : null,
  };
}

function futureDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 10);
  return date.toISOString().slice(0, 10);
}

test("health and public content are available", async () => {
  const { db, app } = setup();
  try {
    const health = await invoke(app, { url: "/api/health" });
    assert.equal(health.status, 200);
    assert.equal(health.body.status, "ok");

    const content = await invoke(app, { url: "/api/experiences" });
    assert.equal(content.status, 200);
    assert.equal(content.body.experiences.length, 5);
    assert.equal(content.body.experiences[0].priceCents, 4500);
  } finally {
    closeDatabase(db);
  }
});

test("booking totals are calculated from the database and portal token grants access", async () => {
  const { db, app } = setup();
  try {
    const created = await invoke(app, {
      method: "POST",
      url: "/api/bookings",
      body: {
        experienceId: "food-cooking",
        guestName: "Test Traveler",
        email: "traveler@example.com",
        phone: "+256700000001",
        guestCount: 2,
        preferredDate: futureDate(),
        specialRequests: "Vegetarian lunch",
        paymentChoice: "deposit",
        price: "$1",
      },
    });

    assert.equal(created.status, 201);
    assert.equal(created.body.booking.totalCents, 9000);
    assert.equal(created.body.booking.amountDueCents, 2700);
    assert.ok(created.body.booking.portalToken);

    const portal = await invoke(app, { url: `/api/portal/${created.body.booking.portalToken}` });
    assert.equal(portal.status, 200);
    assert.equal(portal.body.booking.guestName, "Test Traveler");

    const invalidPortal = await invoke(app, { url: "/api/portal/not-a-real-token" });
    assert.equal(invalidPortal.status, 404);
  } finally {
    closeDatabase(db);
  }
});

test("past dates are rejected", async () => {
  const { db, app } = setup();
  try {
    const result = await invoke(app, {
      method: "POST",
      url: "/api/bookings",
      body: {
        experienceId: "food-cooking",
        guestName: "Test Traveler",
        email: "traveler@example.com",
        phone: "+256700000001",
        guestCount: 1,
        preferredDate: "2020-01-01",
        paymentChoice: "full",
      },
    });
    assert.equal(result.status, 400);
  } finally {
    closeDatabase(db);
  }
});

test("mock payment updates the portal booking", async () => {
  const { db, app } = setup();
  try {
    const created = await invoke(app, {
      method: "POST",
      url: "/api/bookings",
      body: {
        experienceId: "storytelling",
        guestName: "Payment Test",
        email: "payment@example.com",
        phone: "+256700000002",
        guestCount: 1,
        preferredDate: futureDate(),
        paymentChoice: "full",
      },
    });
    const token = created.body.booking.portalToken;
    const payment = await invoke(app, {
      method: "POST",
      url: `/api/portal/${token}/payments`,
      headers: { "idempotency-key": "payment-test-key" },
      body: { method: "mobile-money", simulateResult: "paid" },
    });
    assert.equal(payment.status, 201);
    assert.equal(payment.body.payment.status, "paid");

    const portal = await invoke(app, { url: `/api/portal/${token}` });
    assert.equal(portal.body.booking.paymentStatus, "paid");
    assert.equal(portal.body.booking.bookingStatus, "confirmed");
  } finally {
    closeDatabase(db);
  }
});

test("admin login protects management routes", async () => {
  const { db, app } = setup();
  try {
    const unauthorized = await invoke(app, { url: "/api/admin/bookings" });
    assert.equal(unauthorized.status, 401);

    const invalid = await invoke(app, {
      method: "POST",
      url: "/api/admin/login",
      body: { email: "admin@example.com", password: "wrong-password" },
    });
    assert.equal(invalid.status, 401);

    const login = await invoke(app, {
      method: "POST",
      url: "/api/admin/login",
      body: { email: "admin@example.com", password: "strong-test-password" },
    });
    assert.equal(login.status, 200);
    assert.ok(login.body.token);

    const bookings = await invoke(app, {
      url: "/api/admin/bookings",
      headers: { authorization: `Bearer ${login.body.token}` },
    });
    assert.equal(bookings.status, 200);
  } finally {
    closeDatabase(db);
  }
});

test("email OTP creates and revokes a customer portal session", async () => {
  const requested = [];
  const authProvider = {
    configured: true,
    async requestOtp(email) {
      requested.push(email);
    },
    async verifyOtp(email, otp) {
      assert.equal(email, "otp@example.com");
      assert.equal(otp, "123456");
      return { user: { email } };
    },
  };
  const { db, app } = setup(authProvider);
  try {
    const created = await invoke(app, {
      method: "POST",
      url: "/api/bookings",
      body: {
        experienceId: "storytelling",
        guestName: "OTP Traveler",
        email: "otp@example.com",
        phone: "+256700000003",
        guestCount: 1,
        preferredDate: futureDate(),
        paymentChoice: "deposit",
      },
    });
    const bookingReference = created.body.booking.id;

    const requestOtp = await invoke(app, {
      method: "POST",
      url: "/api/portal-auth/request-otp",
      body: { email: "otp@example.com", bookingReference },
    });
    assert.equal(requestOtp.status, 202);
    assert.deepEqual(requested, ["otp@example.com"]);

    const verified = await invoke(app, {
      method: "POST",
      url: "/api/portal-auth/verify-otp",
      body: { email: "otp@example.com", bookingReference, otp: "123456" },
    });
    assert.equal(verified.status, 200);
    assert.match(verified.headers["set-cookie"], /HttpOnly/);
    const cookie = verified.headers["set-cookie"].split(";")[0];

    const portal = await invoke(app, {
      url: "/api/customer/portal",
      headers: { cookie },
    });
    assert.equal(portal.status, 200);
    assert.equal(portal.body.booking.guestName, "OTP Traveler");

    const logout = await invoke(app, {
      method: "POST",
      url: "/api/customer/logout",
      headers: { cookie },
    });
    assert.equal(logout.status, 204);

    const expired = await invoke(app, {
      url: "/api/customer/portal",
      headers: { cookie },
    });
    assert.equal(expired.status, 401);
  } finally {
    closeDatabase(db);
  }
});
