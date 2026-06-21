import { Navigate, useNavigate, useParams } from "react-router-dom";
import BookingSteps from "../components/BookingSteps";
import { createBookingPayment, getBookingById, updateBooking } from "../data/bookings";
import { useState } from "react";

const paymentMethods = [
  {
    id: "mobile-money",
    title: "Mobile Money",
    description: "Pay with MTN Mobile Money or Airtel Money once the provider is connected.",
    icon: "phone_iphone",
  },
  {
    id: "card",
    title: "Card Payment",
    description: "Pay with Visa or Mastercard through the future payment gateway.",
    icon: "credit_card",
  },
  {
    id: "bank",
    title: "Bank Transfer",
    description: "Request bank transfer details and let the team confirm manually.",
    icon: "account_balance",
  },
];

export default function PaymentMethod() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);
  const booking = bookingId ? getBookingById(bookingId) : undefined;

  if (!booking) {
    return <Navigate to="/booking" replace />;
  }

  async function simulatePayment(result: "success" | "failed" | "pending") {
    if (!booking) return;

    try {
      await createBookingPayment(booking, selectedMethod as "mobile-money" | "card" | "bank", result);
    } catch {
      if (import.meta.env.PROD) return;
      updateBooking(booking.id, {
        paymentStatus: result === "success" ? "paid" : result,
        bookingStatus: result === "success" ? "confirmed" : "pending",
      });
    }

    navigate(`/payment/${result}?booking=${booking.id}`);
  }

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-6xl mx-auto">
      <BookingSteps current={2} />
      <header className="mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
          Payment
        </span>
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface mb-6">
          Choose Payment Method
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
          Select how you would like to pay for {booking.experienceTitle}. These buttons simulate the payment result until the real provider is connected.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {paymentMethods.map((method) => (
            <button
              className={`text-left bg-surface-container-low rounded-2xl p-5 sm:p-6 border transition-colors ${selectedMethod === method.id ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/10"}`}
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              type="button"
            >
              <span className="material-symbols-outlined text-primary text-4xl mb-5">{method.icon}</span>
              <h2 className="font-headline text-2xl font-black text-on-surface mb-3">{method.title}</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{method.description}</p>
            </button>
          ))}
        </section>

        <aside className="lg:col-span-4 bg-surface-container-low rounded-2xl p-5 sm:p-7 border border-outline-variant/10">
          <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Amount</p>
          <p className="font-headline text-4xl sm:text-5xl font-black text-on-surface mb-6 break-words">{booking.amountDue}</p>
          <PaymentFields method={selectedMethod} />
          <div className="grid gap-3">
            <button className="bg-primary text-on-primary min-h-14 rounded-xl px-3 py-3 font-bold uppercase text-sm" onClick={() => simulatePayment("success")} type="button">
              Simulate Successful Payment
            </button>
            <button className="bg-surface text-primary h-12 rounded-xl font-bold" onClick={() => simulatePayment("pending")} type="button">
              Simulate Pending Payment
            </button>
            <button className="bg-surface text-primary h-12 rounded-xl font-bold" onClick={() => simulatePayment("failed")} type="button">
              Simulate Failed Payment
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PaymentFields({ method }: { method: string }) {
  if (method === "mobile-money") {
    return (
      <div className="grid gap-3 mb-5">
        <label className="block">
          <span className="block text-sm font-bold mb-2">Mobile Money Number</span>
          <input className="w-full h-12 rounded-xl bg-surface px-4" placeholder="+256 7XX XXX XXX" type="tel" />
        </label>
        <label className="block">
          <span className="block text-sm font-bold mb-2">Network</span>
          <select className="w-full h-12 rounded-xl bg-surface px-4">
            <option>MTN Mobile Money</option>
            <option>Airtel Money</option>
          </select>
        </label>
      </div>
    );
  }

  if (method === "card") {
    return (
      <div className="grid gap-3 mb-5">
        <input className="w-full h-12 rounded-xl bg-surface px-4" placeholder="Card number" />
        <div className="grid grid-cols-2 gap-3">
          <input className="w-full h-12 rounded-xl bg-surface px-4" placeholder="MM/YY" />
          <input className="w-full h-12 rounded-xl bg-surface px-4" placeholder="CVC" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-4 mb-5 text-sm text-on-surface-variant">
      Bank transfer details will be generated by the backend. For now, simulate pending payment and let the admin confirm manually.
    </div>
  );
}
