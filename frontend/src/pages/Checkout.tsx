import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import BookingSteps from "../components/BookingSteps";
import { getBookingById, updateBooking } from "../data/bookings";
import { useSiteContent } from "../data/content";
import { bookingPath } from "../data/site";

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { site } = useSiteContent();
  const booking = bookingId ? getBookingById(bookingId) : undefined;

  if (!booking) {
    return <Navigate to="/booking" replace />;
  }

  function confirmBooking() {
    if (!booking) return;

    updateBooking(booking.id, {
      bookingStatus: "pending",
    });

    navigate(`/payment-method/${booking.id}`);
  }

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-6xl mx-auto">
      <BookingSteps current={1} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <section className="lg:col-span-7">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            Checkout
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface mb-6">
            Review Your Booking
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
            Confirm the details below before choosing your payment method.
          </p>
        </section>

        <aside className="lg:col-span-5 bg-surface-container-low rounded-2xl p-5 sm:p-8 border border-outline-variant/10 shadow-xl">
          <div className="space-y-6">
            {booking.experienceImage && (
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface">
                <img className="w-full h-full object-cover" src={booking.experienceImage} alt={booking.experienceTitle} />
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Package</p>
              <h2 className="font-headline text-3xl font-black text-on-surface">{booking.experienceTitle}</h2>
            </div>

            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <Info label="Date" value={booking.preferredDate} />
              <Info label="Booking Reference" value={booking.id} />
              <Info label="Guests" value={String(booking.guestCount)} />
              <Info label="Name" value={booking.guestName} />
              <Info label="Phone" value={booking.phone} />
              <Info label="Total" value={priceLabel(booking.totalAmount ?? booking.amountDue)} />
              <Info label="Paying" value={booking.paymentChoice === "full" ? "Full amount" : "Deposit"} />
            </div>

            <div className="h-px bg-outline-variant/20"></div>

            <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Amount Due</p>
                <p className="text-sm text-on-surface-variant">{priceLabel(booking.amountDue) === "To confirm" ? "The team will confirm the payable amount." : `${booking.paymentChoice === "full" ? "Full amount" : "Deposit"} due now.`}</p>
              </div>
              <p className="font-headline text-3xl sm:text-4xl font-black text-primary break-words">{priceLabel(booking.amountDue)}</p>
            </div>

            <div className="grid gap-3">
              <button className="bg-primary text-on-primary h-14 rounded-xl font-bold uppercase tracking-widest" onClick={confirmBooking} type="button">
                Confirm Booking
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 text-sm">
              <Link className="text-primary font-bold" to={bookingPath(booking.experienceTitle)}>Edit booking</Link>
              <a className="text-primary font-bold" href={site.whatsappUrl}>Ask on WhatsApp</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function priceLabel(price: string) {
  return price === "$0" || price === "$0.00" ? "To confirm" : price;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">{label}</p>
      <p className="font-bold text-on-surface break-words">{value}</p>
    </div>
  );
}
