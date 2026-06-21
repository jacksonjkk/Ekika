import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import BookingSteps from "../components/BookingSteps";
import { getBookingById } from "../data/bookings";

const statusCopy = {
  success: {
    label: "Payment Successful",
    title: "You're all set!",
    body: "Your payment is confirmed and your experience is now available in your dashboard.",
    icon: "check_circle",
    iconClass: "bg-secondary-container text-on-secondary-container",
  },
  pending: {
    label: "Payment Pending",
    title: "Your booking is saved.",
    body: "We are waiting for payment confirmation. You can review the booking in your dashboard at any time.",
    icon: "pending",
    iconClass: "bg-tertiary-container text-on-tertiary-container",
  },
  failed: {
    label: "Payment Unsuccessful",
    title: "Let's try that again.",
    body: "No payment was completed, but your booking details are safe. Retry when you're ready.",
    icon: "error",
    iconClass: "bg-red-50 text-red-700",
  },
};

export default function PaymentStatus() {
  const { status } = useParams();
  const [searchParams] = useSearchParams();
  const booking = getBookingById(searchParams.get("booking") ?? "");

  if (status !== "success" && status !== "pending" && status !== "failed") {
    return <Navigate to="/experiences" replace />;
  }

  const copy = statusCopy[status];

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
      <BookingSteps current={3} />

      <section className="overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest shadow-2xl shadow-primary/5">
        <div className="px-6 py-10 sm:px-10 sm:py-14 md:px-14 text-center">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${copy.iconClass}`}>
            <span className="material-symbols-outlined text-5xl" aria-hidden="true">{copy.icon}</span>
          </div>
          <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">{copy.label}</p>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface mb-5">
            {copy.title}
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">{copy.body}</p>
        </div>

        {booking && (
          <div className="border-t border-outline-variant/10 bg-surface-container-low p-5 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 md:gap-8 items-center">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                {booking.experienceImage && (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl bg-surface">
                    <img className="h-full w-full object-cover" src={booking.experienceImage} alt="" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest font-bold text-primary mb-1">Your Experience</p>
                  <h2 className="font-headline text-xl sm:text-2xl font-black text-on-surface break-words">{booking.experienceTitle}</h2>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {formatDate(booking.preferredDate)} · {booking.guestCount} guest{booking.guestCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <SummaryItem label="Payment" value={booking.paymentStatus} />
                <SummaryItem label="Total" value={booking.totalAmount ?? booking.amountDue} />
              </dl>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-outline-variant/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-on-surface-variant break-all">
                Reference: <span className="font-bold text-on-surface">{booking.id}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                {status !== "success" && (
                  <Link
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-container"
                    to={`/payment-method/${booking.id}`}
                  >
                    {status === "failed" ? "Retry Payment" : "Payment Options"}
                  </Link>
                )}
                <Link
                  className={`${status === "success" ? "bg-primary text-on-primary hover:bg-primary-container" : "border border-primary text-primary hover:bg-primary/5"} inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors`}
                  to="/customer-portal"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {!booking && (
          <div className="border-t border-outline-variant/10 bg-surface-container-low p-6 text-center">
            <Link className="inline-flex rounded-xl bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-on-primary" to="/customer-portal">
              Go to Dashboard
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <dt className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">{label}</dt>
      <dd className="font-headline text-lg font-black capitalize text-on-surface break-words">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
