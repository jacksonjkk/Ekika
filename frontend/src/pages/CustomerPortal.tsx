import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomer, apiRequest, fetchCustomerProfile } from "../data/api";
import type { BookingRecord } from "../data/bookings";
import { useSiteContent } from "../data/content";

export default function CustomerPortal() {
  const customer = useCustomer();
  const navigate = useNavigate();
  const { site } = useSiteContent();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    let active = true;

    const request = customer
      ? apiRequest<{ bookings: BookingRecord[] }>("/api/customer/bookings")
      : fetchCustomerProfile().then(() => apiRequest<{ bookings: BookingRecord[] }>("/api/customer/bookings"));

    request
      .then((result) => {
        if (!active) return;
        setBookings(result.bookings);
        if (result.bookings.length > 0) {
          setSelectedBooking(result.bookings[0]);
        }
      })
      .catch((err) => {
        if (!active) return;
        if (!customer) navigate("/customer-access?redirect=/customer-portal", { replace: true });
        else setError(err instanceof Error ? err.message : "Could not retrieve bookings.");
      })
      .finally(() => {
        if (active) setLoadingBookings(false);
      });

    return () => {
      active = false;
    };
  }, [customer, navigate]);

  if (loadingBookings && bookings.length === 0) {
    return (
      <main className="pt-36 pb-20 text-center text-on-surface-variant font-body">
        Checking customer access...
      </main>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter((b) => b.preferredDate >= today && b.bookingStatus !== "cancelled");
  const past = bookings.filter((b) => b.preferredDate < today || b.bookingStatus === "cancelled");

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
      <header className="mb-10 border-b border-outline-variant/15 pb-6">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-4">
            Customer Dashboard
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl font-black text-on-surface">
            Hello, {customer?.name ?? selectedBooking?.guestName ?? "Traveler"}
          </h1>
          <p className="text-on-surface-variant mt-1">
            Manage your cultural journeys and account profile details.
          </p>
        </div>
      </header>

      {error && (
        <div className="mb-8 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">
          {error}
        </div>
      )}

      {loadingBookings ? (
        <div className="text-center py-20 text-on-surface-variant">Loading your reservations...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-surface-container-low rounded-2xl p-10 text-center border border-outline-variant/10">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">calendar_today</span>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">No bookings found</h2>
          <p className="text-on-surface-variant max-w-md mx-auto mb-6">
            You haven't scheduled any Kiga cultural experiences yet. Explore our packages and secure a spot.
          </p>
          <Link
            to="/experiences"
            className="inline-flex bg-primary hover:bg-primary-container text-white px-6 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider"
          >
            Explore Experiences
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Booking List */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-headline text-xl font-black text-on-surface px-1">Upcoming Experiences ({upcoming.length})</h2>
            <div className="space-y-4">
              {upcoming.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`w-full text-left bg-surface-container-low p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    selectedBooking?.id === b.id
                      ? "border-primary ring-2 ring-primary/20 bg-white"
                      : "border-outline-variant/10 hover:border-outline-variant/30"
                  }`}
                >
                  {b.experienceImage && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface">
                      <img className="w-full h-full object-cover" src={b.experienceImage} alt={b.experienceTitle} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-1">{b.preferredDate}</span>
                    <h3 className="font-headline font-bold text-on-surface text-base sm:text-lg truncate">{b.experienceTitle}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {b.guestCount} Guest{b.guestCount === 1 ? "" : "s"} · {b.amountDue}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {past.length > 0 && (
              <div className="pt-6 border-t border-outline-variant/15">
                <h2 className="font-headline text-xl font-black text-on-surface px-1 mb-4">Past & Cancelled ({past.length})</h2>
                <div className="space-y-3">
                  {past.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`w-full text-left bg-surface-container-lowest p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        selectedBooking?.id === b.id ? "border-primary bg-white" : "border-outline-variant/10"
                      }`}
                    >
                      <div className="min-w-0">
                        <h4 className="font-headline font-bold text-on-surface text-sm truncate">{b.experienceTitle}</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5">{b.preferredDate} · {b.bookingStatus}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider ${
                        b.bookingStatus === "cancelled" ? "bg-red-50 text-red-700" : "bg-surface-container-high text-on-surface-variant"
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Selected Booking Details */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/10 shadow-lg">
            {selectedBooking ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-4 border-b border-outline-variant/15">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-primary block mb-1">RESERVATION DETAILS</span>
                    <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface leading-tight">{selectedBooking.experienceTitle}</h2>
                  </div>
                  <span className={`inline-flex self-start px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                    selectedBooking.bookingStatus === "confirmed"
                      ? "bg-secondary-container text-on-secondary-container"
                      : selectedBooking.bookingStatus === "cancelled"
                      ? "bg-red-50 text-red-700"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}>
                    {selectedBooking.bookingStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem label="Session Date" value={selectedBooking.preferredDate} />
                  <DetailItem label="Booking Reference" value={selectedBooking.id} />
                  <DetailItem label="Guests Registered" value={String(selectedBooking.guestCount)} />
                  <DetailItem label="Payment Status" value={selectedBooking.paymentStatus} />
                  <DetailItem label="Deposit / Choice" value={selectedBooking.paymentChoice === "full" ? "Paid In Full" : "Deposit (30%)"} />
                  <DetailItem label="Total Cost" value={selectedBooking.totalAmount ?? selectedBooking.amountDue} />
                </div>

                {selectedBooking.specialRequests && (
                  <div className="bg-surface rounded-2xl p-5 border border-outline-variant/10">
                    <h3 className="font-bold text-sm text-on-surface mb-2 uppercase tracking-wide">Special Requests / Dietary</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed italic">"{selectedBooking.specialRequests}"</p>
                  </div>
                )}

                <div className="bg-surface rounded-2xl p-5 border border-outline-variant/10 space-y-3">
                  <h3 className="font-headline text-lg font-bold">Important Info</h3>
                  <ul className="list-disc list-inside text-sm text-on-surface-variant space-y-2">
                    <li>Meeting point address: <span className="font-semibold">{site.locationLabel}</span></li>
                    <li>What to bring: comfortable walking shoes, water bottle, light rain jacket.</li>
                    <li>Need changes? Contact hosts at least 48 hours prior.</li>
                  </ul>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  {selectedBooking.paymentStatus === "unpaid" && (
                    <Link
                      to={`/checkout/${selectedBooking.id}`}
                      className="flex-1 text-center bg-primary hover:bg-primary-container text-white px-5 py-4 rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">payment</span>
                      <span>Complete Checkout</span>
                    </Link>
                  )}
                  <a
                    href={site.whatsappUrl}
                    className="flex-1 text-center bg-surface-container-high text-[#1f1b13] px-5 py-4 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WhatsApp Guide</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-on-surface-variant">Select a booking to view its details.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-outline-variant/10">
      <span className="block text-2xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">{label}</span>
      <span className="font-bold text-on-surface capitalize break-words text-sm sm:text-base">{value}</span>
    </div>
  );
}
