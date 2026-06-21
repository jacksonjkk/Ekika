import { useEffect, useState } from "react";
import { apiRequest, getAdminToken } from "./api";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";

export type BookingRecord = {
  id: string;
  portalToken: string;
  experienceTitle: string;
  experiencePrice: string;
  experienceImage: string;
  guestName: string;
  email: string;
  phone: string;
  guestCount: number;
  preferredDate: string;
  specialRequests: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  amountDue: string;
  totalAmount: string;
  paymentChoice: "deposit" | "full";
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingInput = Omit<BookingRecord, "id" | "portalToken" | "bookingStatus" | "paymentStatus" | "createdAt" | "updatedAt"> & {
  experienceId?: string;
};

const STORAGE_KEY = "ekika-bookings";

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getBookings(): BookingRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: BookingRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new Event("ekika-bookings-updated"));
}

export async function createBooking(input: CreateBookingInput) {
  try {
    const result = await apiRequest<{ booking: BookingRecord }>("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        experienceId: input.experienceId,
        experienceTitle: input.experienceTitle,
        guestName: input.guestName,
        email: input.email,
        phone: input.phone,
        guestCount: input.guestCount,
        preferredDate: input.preferredDate,
        specialRequests: input.specialRequests,
        paymentChoice: input.paymentChoice,
      }),
    });
    saveBookings([result.booking, ...getBookings().filter((booking) => booking.id !== result.booking.id)]);
    return result.booking;
  } catch (error) {
    if (import.meta.env.PROD) throw error;
  }

  const now = new Date().toISOString();
  const booking: BookingRecord = {
    ...input,
    id: makeId("booking"),
    portalToken: makeId("portal"),
    bookingStatus: "pending",
    paymentStatus: "unpaid",
    createdAt: now,
    updatedAt: now,
  };

  saveBookings([booking, ...getBookings()]);
  return booking;
}

export function getBookingById(id: string) {
  return getBookings().find((booking) => booking.id === id);
}

export function getBookingByToken(token: string) {
  return getBookings().find((booking) => booking.portalToken === token);
}

export function updateBooking(id: string, updates: Partial<BookingRecord>) {
  let updated: BookingRecord | undefined;
  const bookings = getBookings().map((booking) => {
    if (booking.id !== id) return booking;

    updated = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  saveBookings(bookings);
  if (getAdminToken()) {
    const statusUpdates = {
      ...(updates.bookingStatus ? { bookingStatus: updates.bookingStatus } : {}),
      ...(updates.paymentStatus ? { paymentStatus: updates.paymentStatus } : {}),
    };
    if (Object.keys(statusUpdates).length) {
      apiRequest(`/api/admin/bookings/${encodeURIComponent(id)}`, {
        admin: true,
        method: "PATCH",
        body: JSON.stringify(statusUpdates),
      }).catch(() => undefined);
    }
  }
  return updated;
}

export async function updateAdminBookingDetails(
  id: string,
  updates: Pick<BookingRecord, "guestName" | "email" | "phone" | "guestCount" | "preferredDate" | "specialRequests">,
) {
  const result = await apiRequest<{ booking: BookingRecord }>(`/api/admin/bookings/${encodeURIComponent(id)}`, {
    admin: true,
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  const existing = getBookingById(id);
  const booking = { ...result.booking, portalToken: existing?.portalToken ?? result.booking.portalToken ?? "" };
  saveBookings([booking, ...getBookings().filter((item) => item.id !== id)]);
  return booking;
}

export async function createBookingPayment(
  booking: BookingRecord,
  method: "mobile-money" | "card" | "bank",
  result: "success" | "failed" | "pending",
) {
  const paymentResult = await apiRequest<{ payment: { status: "paid" | "failed" | "pending" } }>(
    `/api/portal/${encodeURIComponent(booking.portalToken)}/payments`,
    {
      method: "POST",
      headers: { "Idempotency-Key": `${booking.id}-${method}-${Date.now()}` },
      body: JSON.stringify({ method, simulateResult: result === "success" ? "paid" : result }),
    },
  );
  const paymentStatus = paymentResult.payment.status;
  return updateBooking(booking.id, {
    paymentStatus,
    bookingStatus: paymentStatus === "paid" ? "confirmed" : "pending",
  });
}

export async function fetchBookingByToken(token: string) {
  const result = await apiRequest<{ booking: BookingRecord }>(`/api/portal/${encodeURIComponent(token)}`);
  const booking = { ...result.booking, portalToken: token };
  saveBookings([booking, ...getBookings().filter((item) => item.id !== booking.id)]);
  return booking;
}

export async function createAdminPortalToken(booking: BookingRecord) {
  const result = await apiRequest<{ portalToken: string }>(`/api/admin/bookings/${encodeURIComponent(booking.id)}/portal-token`, {
    admin: true,
    method: "POST",
  });
  return updateBooking(booking.id, { portalToken: result.portalToken });
}

export function useBookings() {
  const [bookings, setBookings] = useState(getBookings);

  useEffect(() => {
    function refresh() {
      setBookings(getBookings());
    }

    function refreshFromServer() {
      if (!getAdminToken()) return;
      apiRequest<{ bookings: BookingRecord[] }>("/api/admin/bookings", { admin: true })
        .then((result) => {
          const localTokens = new Map(getBookings().map((booking) => [booking.id, booking.portalToken]));
          const bookings = result.bookings.map((booking) => ({ ...booking, portalToken: localTokens.get(booking.id) ?? "" }));
          saveBookings(bookings);
        })
        .catch(() => undefined);
    }

    window.addEventListener("storage", refresh);
    window.addEventListener("ekika-bookings-updated", refresh);
    window.addEventListener("ekika-admin-auth-updated", refreshFromServer);
    refreshFromServer();

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ekika-bookings-updated", refresh);
      window.removeEventListener("ekika-admin-auth-updated", refreshFromServer);
    };
  }, []);

  return bookings;
}
