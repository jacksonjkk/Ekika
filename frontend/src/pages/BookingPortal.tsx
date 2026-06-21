import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { fetchBookingByToken, getBookingByToken } from "../data/bookings";
import type { BookingRecord } from "../data/bookings";
import { useSiteContent } from "../data/content";

export default function BookingPortal() {
  const { token } = useParams();
  const cachedBooking = token ? getBookingByToken(token) : undefined;
  const [booking, setBooking] = useState(cachedBooking);
  const [loading, setLoading] = useState(Boolean(token) && !cachedBooking);

  useEffect(() => {
    if (!token) return;
    fetchBookingByToken(token)
      .then(setBooking)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 px-5 text-center text-on-surface-variant">Loading your booking...</main>;
  }

  if (!booking) {
    return <Navigate to="/booking" replace />;
  }

  return <BookingDashboard booking={booking} />;
}

export function BookingDashboard({ booking, onLogout }: { booking: BookingRecord; onLogout?: () => void }) {
  const { site } = useSiteContent();
  const daysRemaining = getDaysRemaining(booking.preferredDate);

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
      <header className="mb-10 relative">
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
          Booking Portal
        </span>
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface mb-4 break-words">
          Hello, {booking.guestName}
        </h1>
        <p className="text-lg text-on-surface-variant">Your cultural experience details are ready below.</p>
        {onLogout && (
          <button className="mt-5 border border-primary text-primary px-5 py-3 rounded-xl font-bold" onClick={onLogout} type="button">
            Sign Out
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 bg-surface-container-low rounded-2xl p-5 sm:p-8 border border-outline-variant/10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Booked Experience</p>
              <h2 className="font-headline text-3xl sm:text-4xl font-black text-on-surface break-words">{booking.experienceTitle}</h2>
            </div>
            <div className="bg-primary text-on-primary rounded-2xl p-5 text-center w-full md:w-auto md:min-w-36">
              <p className="font-headline text-4xl font-black">{daysRemaining}</p>
              <p className="text-xs uppercase tracking-widest font-bold">{daysRemaining === 1 ? "Day Left" : "Days Left"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Info label="Session Date" value={booking.preferredDate} />
            <Info label="Booking Reference" value={booking.id} />
            <Info label="Guests" value={String(booking.guestCount)} />
            <Info label="Amount" value={booking.amountDue} />
            <Info label="Total" value={booking.totalAmount ?? booking.amountDue} />
            <Info label="Payment" value={booking.paymentStatus} />
            <Info label="Booking" value={booking.bookingStatus} />
            <Info label="Phone" value={booking.phone} />
          </div>

          <div className="bg-surface rounded-2xl p-6">
            <h3 className="font-headline text-2xl font-black mb-4">What to bring</h3>
            <ul className="grid gap-3 text-on-surface-variant">
              <li>Comfortable walking shoes</li>
              <li>Water bottle and light rain jacket</li>
              <li>Any dietary or medical notes for the host team</li>
            </ul>
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-5 sm:p-8 border border-outline-variant/10">
            <h3 className="font-headline text-2xl font-black mb-4">Meeting Point</h3>
            <p className="text-on-surface-variant leading-relaxed mb-5">{site.locationLabel}</p>
            <a className="inline-flex bg-primary text-on-primary px-5 py-3 rounded-xl font-bold" href={site.whatsappUrl}>
              Message Guide
            </a>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-5 sm:p-8 border border-outline-variant/10">
            <h3 className="font-headline text-2xl font-black mb-4">Receipt</h3>
            <p className="text-on-surface-variant mb-5">Receipt download will be available after real payment integration.</p>
            <Link className="text-primary font-bold" to={`/checkout/${booking.id}`}>
              View Checkout
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function getDaysRemaining(dateValue: string) {
  const session = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  session.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((session.getTime() - today.getTime()) / 86400000));
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">{label}</p>
      <p className="font-bold text-on-surface capitalize break-words">{value}</p>
    </div>
  );
}
