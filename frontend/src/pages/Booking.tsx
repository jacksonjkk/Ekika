import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BookingSteps from "../components/BookingSteps";
import { createBooking } from "../data/bookings";
import { useSiteContent } from "../data/content";
import { useCustomer } from "../data/api";
import { bookingPath } from "../data/site";
import { formatUsd, getDepositAmount, parsePrice, todayString } from "../utils/booking";

export default function Booking() {
  const customer = useCustomer();
  const { site, experiences } = useSiteContent();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingExperiences = [...experiences.map((experience) => experience.title), "Custom Group Itinerary"];
  const [searchParams] = useSearchParams();
  const requestedExperience = searchParams.get("experience");
  const hasSelectedExperience = requestedExperience !== null && bookingExperiences.includes(requestedExperience);
  const defaultExperience = hasSelectedExperience
    ? requestedExperience
    : bookingExperiences[0] ?? "Custom Group Itinerary";
  const [selectedExperience, setSelectedExperience] = useState(defaultExperience);
  const [submitted, setSubmitted] = useState(false);
  const [guestCountInput, setGuestCountInput] = useState("1");
  const [paymentChoice, setPaymentChoice] = useState<"deposit" | "full">("deposit");
  const preferredDateRef = useRef<HTMLInputElement>(null);
  const selectedPackage = experiences.find((experience) => experience.title === selectedExperience);
  const unitPrice = parsePrice(selectedPackage?.price ?? "0");
  const guestCount = Math.max(1, Math.min(20, Number(guestCountInput) || 1));
  const totalAmount = unitPrice * guestCount;
  const depositAmount = getDepositAmount(totalAmount);

  useEffect(() => {
    setSelectedExperience(defaultExperience);
  }, [defaultExperience]);

  useEffect(() => {
    if (location.hash !== "#booking-form") return;

    window.requestAnimationFrame(() => {
      document.getElementById("booking-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.hash, searchParams]);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Booking request: ${selectedExperience}`);
    const body = encodeURIComponent(
      `Hello Ekika team,\n\nI would like to book: ${selectedExperience}\n\nName:\nGuests:\nPreferred date:\nPhone:\nSpecial requests:\n\nThank you.`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }, [selectedExperience, site.email]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const matchingExperience = experiences.find((experience) => experience.title === selectedExperience);
    const submittedGuests = Number(formData.get("guestCount") ?? 1);
    const submittedTotal = parsePrice(matchingExperience?.price ?? "0") * submittedGuests;
    const submittedDue = paymentChoice === "full" ? submittedTotal : getDepositAmount(submittedTotal);
    const booking = await createBooking({
      experienceId: matchingExperience?.id,
      experienceTitle: selectedExperience,
      experiencePrice: matchingExperience?.price ?? "Custom",
      experienceImage: matchingExperience?.image ?? "",
      totalAmount: submittedTotal ? formatUsd(submittedTotal) : "To be confirmed",
      amountDue: submittedDue ? formatUsd(submittedDue) : "To be confirmed",
      paymentChoice,
      guestName: String(formData.get("guestName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      guestCount: submittedGuests,
      preferredDate: String(formData.get("preferredDate") ?? ""),
      specialRequests: String(formData.get("specialRequests") ?? ""),
    });

    setSubmitted(true);
    navigate(`/checkout/${booking.id}`);
  }

  function openDatePicker() {
    preferredDateRef.current?.showPicker?.();
    preferredDateRef.current?.focus();
  }

  if (!hasSelectedExperience) {
    return <Navigate to="/experiences" replace />;
  }

  if (!customer) {
    const redirectPath = bookingPath(selectedExperience);
    return <Navigate to={`/customer-access?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
      <BookingSteps current={0} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Side: Editorial Context & Visuals */}
        <div className="lg:col-span-5 space-y-12">
          <header className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-bold tracking-widest uppercase">Reserve Experience</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-background leading-[1.1]">Secure Your Place at the Griot’s Hearth.</h1>
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">Join us in the misty highlands of Kabale. Every booking supports local artisans and preserves the ancestral traditions of the Bakiga people.</p>
          </header>
          {/* Asymmetric Image Placement */}
          <div className="relative group">
            <div className="aspect-[4/3] lg:aspect-[4/5] rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
              <img className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmSPlPxungJzcsKfM69sK022lBZOrM0TOxbhnlzehgN1kcpPS9JLc4Pi0EUlO4HZPhZ-mMmW6S2BMjrFY9tTcBZgblx0dVIdN2wMZ_ThbXRxuSY_dH6mufBiydGsPuzd-7CysAjN43xKwTi1PwOjDvSxS6Kn0EEZl_MhkvMWvnSaY-JlOA0tmleOXm_JYREjPyYHepTtnTOvYpGX110XMkLCyKArUgO4FLqdtm10kf1DanOrGHQzVM4uiP4sUMyM-J_OTD3AEK6DA" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden border-[8px] border-surface hidden md:block">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpbP7_6h2xwrKfWb-6FUQxzEHJ3D5xqvW1fNoMR_m-ypdMdTaB93ypVPu9Fl-9CXzIzpE-BsBKCTwxoHpmo6TJGXT0UhfaDkR-HzbMUxYaSr_zlYLT-0eZLRoIm9Aw64dI2zRmQO_FIcLPENIyiU8lare-UAz7PFko0Lhe9MFxooVqdk4gkJZ0uP_UQDyD1VGNjCBZZi3q0qTpqEKolrLtAzQ8BtoPiSUzvKx-PJSSv4tQCn0N7WPyBbDNQdjCn_KBznW3dtvMUq0" />
            </div>
          </div>
          <div className="pt-8 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary p-3 bg-primary/5 rounded-full">verified_user</span>
              <div>
                <h3 className="font-bold text-on-surface">Sustainable Travel</h3>
                <p className="text-sm text-on-surface-variant">100% of proceeds fund community education initiatives.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary p-3 bg-primary/5 rounded-full">event_available</span>
              <div>
                <h3 className="font-bold text-on-surface">Flexible Cancellation</h3>
                <p className="text-sm text-on-surface-variant">Cancel up to 48 hours before for a full refund.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="lg:col-span-7 scroll-mt-28 md:scroll-mt-40" id="booking-form">
          <div className="bg-surface-container-lowest p-5 sm:p-8 md:p-12 rounded-2xl md:rounded-[32px] shadow-2xl shadow-primary/5 border border-outline-variant/10">
            {submitted && (
              <div className="mb-8 rounded-2xl bg-secondary-container text-on-secondary-container p-6 border border-secondary/10">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                  <div>
                    <h2 className="font-headline text-2xl font-black mb-2">Request captured</h2>
                    <p className="text-sm leading-relaxed mb-4">
                      Your booking details are ready. Continue to checkout to simulate the payment step before backend integration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a className="inline-flex justify-center bg-primary text-on-primary px-5 py-3 rounded-xl font-bold" href={mailtoHref}>
                        Email Backup
                      </a>
                      <a className="inline-flex justify-center bg-white text-primary px-5 py-3 rounded-xl font-bold" href={site.whatsappUrl}>
                        WhatsApp Team
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2 min-w-0 overflow-hidden">
                  <label className="block text-sm font-bold text-on-surface tracking-wide px-1">SELECT EXPERIENCE</label>
                  <select
                    className="block w-full max-w-full min-w-0 h-14 bg-surface-container-high border-none rounded-xl px-4 pr-10 text-sm sm:text-base text-on-surface text-ellipsis whitespace-nowrap overflow-hidden focus:ring-0 focus:bg-surface-container-lowest transition-colors appearance-none cursor-pointer"
                    value={selectedExperience}
                    onChange={(event) => setSelectedExperience(event.target.value)}
                    required
                  >
                    {bookingExperiences.map((experience) => (
                      <option key={experience}>{experience}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface tracking-wide px-1">NUMBER OF GUESTS</label>
                  <div className="relative">
                    <input
                      className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all"
                      inputMode="numeric"
                      max="20"
                      min="1"
                      name="guestCount"
                      onBlur={() => {
                        if (!guestCountInput) setGuestCountInput("1");
                      }}
                      onChange={(event) => setGuestCountInput(event.target.value)}
                      placeholder="Enter number of guests"
                      type="number"
                      value={guestCountInput}
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">group</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface tracking-wide px-1">PREFERRED DATE</label>
                <div className="relative">
                  <input ref={preferredDateRef} className="date-input w-full h-14 bg-surface-container-high border-none rounded-xl px-4 pr-12 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all" min={todayString()} name="preferredDate" type="date" required />
                  <button
                    aria-label="Open calendar"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                    onClick={openDatePicker}
                    type="button"
                  >
                    <span className="material-symbols-outlined">calendar_today</span>
                  </button>
                </div>
              </div>
              <div className="h-px bg-surface-container-high"></div>
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-on-background">Your Contact Details</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-on-surface tracking-wide px-1">FULL NAME</label>
                    <input
                      className={`w-full h-14 border-none rounded-xl px-4 text-on-surface focus:ring-0 transition-all ${
                        customer ? "bg-surface-container-high opacity-70" : "bg-surface-container-high focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary"
                      }`}
                      defaultValue={customer?.name ?? ""}
                      name="guestName"
                      placeholder="Abebe Bikila"
                      type="text"
                      readOnly={Boolean(customer)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface tracking-wide px-1">EMAIL ADDRESS</label>
                      <input
                        className={`w-full h-14 border-none rounded-xl px-4 text-on-surface focus:ring-0 transition-all ${
                          customer ? "bg-surface-container-high opacity-70" : "bg-surface-container-high focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary"
                        }`}
                        defaultValue={customer?.email ?? ""}
                        name="email"
                        placeholder="traveler@world.com"
                        type="email"
                        readOnly={Boolean(customer)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface tracking-wide px-1">PHONE NUMBER</label>
                      <input
                        className={`w-full h-14 border-none rounded-xl px-4 text-on-surface focus:ring-0 transition-all ${
                          customer ? "bg-surface-container-high opacity-70" : "bg-surface-container-high focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary"
                        }`}
                        defaultValue={customer?.phone ?? ""}
                        name="phone"
                        placeholder="+256 --- --- ---"
                        type="tel"
                        readOnly={Boolean(customer)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface tracking-wide px-1">DIETARY REQUIREMENTS / SPECIAL REQUESTS</label>
                <textarea className="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all resize-none" name="specialRequests" placeholder="Tell us about any preferences or needs..." rows={3}></textarea>
              </div>
              <section className="bg-surface-container-high rounded-2xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <h3 className="font-headline text-2xl font-black text-on-surface">Price Summary</h3>
                    <p className="text-sm text-on-surface-variant">{selectedPackage?.price ?? "Custom"} per person x {guestCount} guest{guestCount === 1 ? "" : "s"}</p>
                  </div>
                  <p className="font-headline text-3xl font-black text-primary">{totalAmount ? formatUsd(totalAmount) : "To confirm"}</p>
                </div>
                <div className="bg-white rounded-xl p-4 flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2">
                  <span className="text-sm font-bold text-on-surface-variant">Due at payment step</span>
                  <span className="font-headline text-2xl font-black text-primary">
                    {totalAmount ? formatUsd(paymentChoice === "full" ? totalAmount : depositAmount) : "To confirm"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`rounded-xl p-4 border cursor-pointer ${paymentChoice === "deposit" ? "border-primary bg-white" : "border-transparent bg-surface-container-low"}`}>
                    <input className="sr-only" checked={paymentChoice === "deposit"} name="paymentChoice" onChange={() => setPaymentChoice("deposit")} type="radio" />
                    <span className="block font-bold text-on-surface">Pay Deposit</span>
                    <span className="block text-sm text-on-surface-variant">30% now: {totalAmount ? formatUsd(depositAmount) : "To confirm"}</span>
                  </label>
                  <label className={`rounded-xl p-4 border cursor-pointer ${paymentChoice === "full" ? "border-primary bg-white" : "border-transparent bg-surface-container-low"}`}>
                    <input className="sr-only" checked={paymentChoice === "full"} name="paymentChoice" onChange={() => setPaymentChoice("full")} type="radio" />
                    <span className="block font-bold text-on-surface">Pay Full Amount</span>
                    <span className="block text-sm text-on-surface-variant">Total due: {totalAmount ? formatUsd(totalAmount) : "To confirm"}</span>
                  </label>
                </div>
              </section>
              <div className="pt-4">
                <button className="w-full min-h-16 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl px-4 py-3 font-bold text-sm sm:text-base uppercase shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-center" type="submit">
                  <span>Continue to Checkout</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-4 leading-relaxed">By confirming, you agree to our Traveler Safety guidelines and Terms of Service. A representative will contact you within 24 hours to finalize details.</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Experience Cards (Contextual Discovery) */}
      <section className="mt-16 md:mt-24 pt-16 md:pt-24 border-t border-outline-variant/10">
        <div className="mb-10 md:mb-16 space-y-4 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">Curated Highland Experiences</h2>
          <p className="text-on-surface-variant max-w-2xl">Discover the stories woven into every hill. Choose the journey that speaks to your spirit.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.slice(0, 3).map((experience) => (
          <Link className="bg-surface rounded-2xl overflow-hidden group shadow-sm border border-outline-variant/5 block" key={experience.id} to={`/booking?experience=${encodeURIComponent(experience.title)}#booking-form`}>
            <div className="aspect-video overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={experience.image} alt={experience.title} />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold">{experience.title}</h3>
              <p className="text-on-surface-variant text-sm">{experience.description}</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-primary font-bold">{experience.price} / person</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
          </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
