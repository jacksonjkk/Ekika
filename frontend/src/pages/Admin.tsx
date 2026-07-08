import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { apiRequest, loginAdmin, updateAdminSettings, getAuditLogs, getAdminReviews, createReview, updateReview, deleteReview, useAdminAuth } from "../data/api";
import type { AuditLog, Review, ReviewDraft } from "../data/api";
import { updateAdminBookingDetails, updateBooking, useBookings } from "../data/bookings";
import type { BookingStatus, PaymentStatus } from "../data/bookings";
import type { SiteContent } from "../data/content";
import { createBlankExperience, getSiteContent, saveSiteContent } from "../data/content";

type AdminBookingDraft = {
  guestName: string;
  email: string;
  phone: string;
  guestCount: number;
  preferredDate: string;
  specialRequests: string;
};

type ExperienceTextField = Exclude<keyof SiteContent["experiences"][number], "slideshowImages">;

function Admin() {
  const isAuthed = useAdminAuth();
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL ?? "admin@ekikaexperience.ug");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<SiteContent>(getSiteContent);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"site" | "experiences" | "bookings" | "gallery" | "reviews" | "activity" | "settings">("bookings");
  const [experienceDraft, setExperienceDraft] = useState(createEmptyExperience);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [experienceError, setExperienceError] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [bookingDraft, setBookingDraft] = useState<AdminBookingDraft | null>(null);
  const [bookingEditError, setBookingEditError] = useState("");
  const [savingBooking, setSavingBooking] = useState(false);
  const bookingDetailsRef = useRef<HTMLElement>(null);
  const bookings = useBookings();
  const selectedBooking = selectedBookingId ? bookings.find((booking) => booking.id === selectedBookingId) : undefined;

  useEffect(() => {
    if (!selectedBookingId || !window.matchMedia("(max-width: 1023px)").matches) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.requestAnimationFrame(() => {
      bookingDetailsRef.current?.focus();
    });

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSelectedBookingId(null);
      setBookingDraft(null);
      setBookingEditError("");
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedBookingId]);

  function closeBookingDetails() {
    setSelectedBookingId(null);
    setBookingDraft(null);
    setBookingEditError("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    try {
      await loginAdmin(email, password);
      setPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unable to sign in");
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveStatus === "saving") return;
    setSaveStatus("saving");
    setSaveMessage("");
    try {
      await saveSiteContent(content);
      setSaveStatus("success");
      setSaveMessage("Your updates are saved and now available on the public website.");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Updates could not be saved. Please try again.");
    }
  }

  function updateSite(field: keyof SiteContent["site"], value: string) {
    setSaveStatus("idle");
    setContent((current) => ({
      ...current,
      site: {
        ...current.site,
        [field]: field === "address" ? value.split("\n").filter(Boolean) : value,
      },
    }));
  }

  function updateExperienceDraft(field: ExperienceTextField, value: string) {
    setSaveStatus("idle");
    setExperienceError("");
    setExperienceDraft((current) => ({
      ...current,
      [field]: field === "included" ? value.split("\n").filter(Boolean) : value,
    }));
  }

  function updateExperienceSlide(index: number, imageUrl: string) {
    setSaveStatus("idle");
    setExperienceError("");
    setExperienceDraft((current) => ({
      ...current,
      slideshowImages: current.slideshowImages.map((slide, slideIndex) => (slideIndex === index ? imageUrl : slide)),
    }));
  }

  function addExperienceSlide() {
    setSaveStatus("idle");
    setExperienceError("");
    setExperienceDraft((current) => ({
      ...current,
      slideshowImages: [...current.slideshowImages, ""],
    }));
  }

  function removeExperienceSlide(index: number) {
    setSaveStatus("idle");
    setExperienceError("");
    setExperienceDraft((current) => {
      const nextSlides = current.slideshowImages.filter((_, slideIndex) => slideIndex !== index);
      return {
        ...current,
        slideshowImages: nextSlides.length > 0 ? nextSlides : [""],
      };
    });
  }

  function clearExperienceForm() {
    setExperienceDraft(createEmptyExperience());
    setEditingExperienceId(null);
    setExperienceError("");
  }

  function editExperience(experience: SiteContent["experiences"][number]) {
    setExperienceDraft({ ...experience, included: [...experience.included], slideshowImages: [...experience.slideshowImages] });
    setEditingExperienceId(experience.id);
    setExperienceError("");
  }

  function submitExperience() {
    if (!experienceDraft.title.trim() || !experienceDraft.description.trim() || !experienceDraft.price.trim() || !experienceDraft.duration.trim() || !experienceDraft.image) {
      setExperienceError("Add a title, description, price, duration, and cover image before continuing.");
      return;
    }
    setSaveStatus("idle");
    setContent((current) => ({
      ...current,
      experiences: editingExperienceId
        ? current.experiences.map((experience) => experience.id === editingExperienceId ? experienceDraft : experience)
        : [...current.experiences, experienceDraft],
    }));
    clearExperienceForm();
  }

  function removeExperience(index: number) {
    const experience = content.experiences[index];
    if (experience && !window.confirm(`Remove "${experience.title}" from the website?`)) return;
    setSaveStatus("idle");

    setContent((current) => ({
      ...current,
      experiences: current.experiences.filter((_, experienceIndex) => experienceIndex !== index),
    }));
    if (editingExperienceId === experience?.id) clearExperienceForm();
  }

  function handleBookingStatus(id: string, bookingStatus: BookingStatus) {
    updateBooking(id, { bookingStatus });
  }

  function handlePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    updateBooking(id, { paymentStatus });
  }

  function beginBookingEdit(booking: (typeof bookings)[number]) {
    setSelectedBookingId(booking.id);
    setBookingDraft({
      guestName: booking.guestName,
      email: booking.email,
      phone: booking.phone,
      guestCount: booking.guestCount,
      preferredDate: booking.preferredDate,
      specialRequests: booking.specialRequests,
    });
    setBookingEditError("");
  }

  async function saveBookingDetails() {
    if (!selectedBooking || !bookingDraft) return;
    setSavingBooking(true);
    setBookingEditError("");
    try {
      await updateAdminBookingDetails(selectedBooking.id, bookingDraft);
      setBookingDraft(null);
    } catch (error) {
      setBookingEditError(error instanceof Error ? error.message : "Booking details could not be saved.");
    } finally {
      setSavingBooking(false);
    }
  }

  if (!isAuthed) {
    return (
      <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-xl mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-8 md:p-10 shadow-xl border border-outline-variant/10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            Admin
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-on-surface mb-4">
            Dashboard Login
          </h1>
          <p className="text-on-surface-variant mb-8">
            Use the temporary local password to manage website content on this browser.
          </p>
          <form className="space-y-5" onSubmit={handleLogin}>
            {loginError && <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">{loginError}</p>}
            <input
              className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              type="email"
              value={email}
              required
            />
            <div className="relative">
              <input
                className="w-full h-14 bg-surface-container-high border-none rounded-xl pl-4 pr-12 text-on-surface"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin password"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <button className="w-full bg-primary text-on-primary h-14 rounded-xl font-bold uppercase tracking-widest" type="submit">
              Sign In
            </button>
          </form>
          <p className="text-xs text-on-surface-variant mt-6">Use the admin credentials configured in the backend environment.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
      <header className="mb-10">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-5">
            Admin
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface">
            Website Dashboard
          </h1>
        </div>
      </header>

      <form className="space-y-10" onSubmit={handleSave}>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 bg-surface-container-low rounded-2xl p-2">
          {[
            ["bookings", "Bookings"],
            ["experiences", "Packages"],
            ["site", "Site"],
            ["gallery", "Gallery"],
            ["reviews", "Reviews"],
            ["activity", "Activity"],
            ["settings", "Settings"],
          ].map(([value, label]) => (
            <button
              className={`px-3 sm:px-5 py-3 rounded-xl text-sm sm:text-base font-bold ${activeTab === value ? "bg-primary text-on-primary" : "text-primary"}`}
              key={value}
              onClick={() => setActiveTab(value as typeof activeTab)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "site" && <section className="bg-surface-container-low rounded-2xl p-5 sm:p-8 border border-outline-variant/10">
          <h2 className="font-headline text-3xl font-black mb-6">Site Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdminField label="Business Name" value={content.site.name} onChange={(value) => updateSite("name", value)} />
            <AdminField label="Short Name" value={content.site.shortName} onChange={(value) => updateSite("shortName", value)} />
            <AdminField label="Email" value={content.site.email} onChange={(value) => updateSite("email", value)} />
            <AdminField label="Display Phone" value={content.site.phoneDisplay} onChange={(value) => updateSite("phoneDisplay", value)} />
            <AdminField label="Phone Link" value={content.site.phoneHref} onChange={(value) => updateSite("phoneHref", value)} />
            <AdminField label="WhatsApp Link" value={content.site.whatsappUrl} onChange={(value) => updateSite("whatsappUrl", value)} />
            <AdminField label="Location Label" value={content.site.locationLabel} onChange={(value) => updateSite("locationLabel", value)} />
            <AdminTextarea label="Address Lines" value={content.site.address.join("\n")} onChange={(value) => updateSite("address", value)} />
          </div>
        </section>}

        {activeTab === "bookings" && <section className="space-y-6">
          <div>
            <h2 className="font-headline text-3xl font-black">Customer Bookings</h2>
            <p className="text-on-surface-variant mt-2">Select a booking to review it. Use Edit Details only when a customer requests a correction.</p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-surface-container-low rounded-2xl p-5 sm:p-8 border border-outline-variant/10 text-center">
              <p className="text-on-surface-variant">No booking requests yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
                <div className="flex items-center justify-between px-2 pb-4">
                  <h3 className="font-headline text-xl font-black">All Bookings</h3>
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-on-surface-variant">{bookings.length}</span>
                </div>
                <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
                  {bookings.map((booking) => (
                    <article
                      className={`w-full rounded-xl border p-4 transition-colors ${selectedBooking?.id === booking.id ? "border-primary bg-white ring-2 ring-primary/15" : "border-outline-variant/10 bg-surface"}`}
                      key={booking.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">{booking.preferredDate}</p>
                          <h4 className="font-headline font-black truncate">{booking.experienceTitle}</h4>
                          <p className="text-xs text-on-surface-variant truncate mt-1">{booking.guestName} · {booking.guestCount} guest{booking.guestCount === 1 ? "" : "s"}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${booking.bookingStatus === "confirmed" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      <button
                        aria-expanded={selectedBooking?.id === booking.id}
                        className={`mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${selectedBooking?.id === booking.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary"}`}
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setBookingDraft(null);
                          setBookingEditError("");
                        }}
                        type="button"
                      >
                        {selectedBooking?.id === booking.id ? "Viewing Details" : "View Details"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              {selectedBooking && (
                <div
                  className="lg:col-span-7 max-lg:fixed max-lg:inset-0 max-lg:z-[70] max-lg:bg-black/55 max-lg:backdrop-blur-sm max-lg:p-4 max-lg:overflow-y-auto"
                  onClick={(event) => {
                    if (event.target === event.currentTarget) closeBookingDetails();
                  }}
                >
                <article
                  aria-labelledby="booking-details-title"
                  className="relative bg-surface-container-low rounded-2xl p-5 sm:p-7 border border-outline-variant/10 shadow-2xl outline-none max-lg:mx-auto max-lg:my-4 max-lg:max-w-2xl lg:shadow-lg"
                  ref={bookingDetailsRef}
                  role="dialog"
                  tabIndex={-1}
                >
                  <button
                    aria-label="Close booking details"
                    className="lg:hidden absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface shadow-md"
                    onClick={closeBookingDetails}
                    type="button"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-outline-variant/10">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Booking Details</p>
                      <h3 className="font-headline text-2xl sm:text-3xl font-black pr-10 lg:pr-0" id="booking-details-title">{selectedBooking.experienceTitle}</h3>
                      <p className="text-xs text-on-surface-variant mt-2 break-all">Reference: {selectedBooking.id}</p>
                    </div>
                    {!bookingDraft && <button className="bg-primary text-on-primary px-5 py-3 rounded-xl font-bold text-sm" onClick={() => beginBookingEdit(selectedBooking)} type="button">Edit Details</button>}
                  </div>

                  {bookingEditError && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">{bookingEditError}</p>}

                  {bookingDraft ? (
                    <div className="mt-6 space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <AdminField label="Customer Name" value={bookingDraft.guestName} onChange={(guestName) => setBookingDraft((current) => current ? { ...current, guestName } : current)} />
                        <AdminField label="Email" value={bookingDraft.email} onChange={(email) => setBookingDraft((current) => current ? { ...current, email } : current)} />
                        <AdminField label="Phone" value={bookingDraft.phone} onChange={(phone) => setBookingDraft((current) => current ? { ...current, phone } : current)} />
                        <label className="block">
                          <span className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2">Guests</span>
                          <input className="w-full h-14 bg-surface border-none rounded-xl px-4 text-on-surface" min="1" max="100" onChange={(event) => setBookingDraft((current) => current ? { ...current, guestCount: Number(event.target.value) } : current)} type="number" value={bookingDraft.guestCount} />
                        </label>
                        <label className="block sm:col-span-2">
                          <span className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2">Experience Date</span>
                          <input className="w-full h-14 bg-surface border-none rounded-xl px-4 text-on-surface" onChange={(event) => setBookingDraft((current) => current ? { ...current, preferredDate: event.target.value } : current)} type="date" value={bookingDraft.preferredDate} />
                        </label>
                      </div>
                      <AdminTextarea label="Special Requests" value={bookingDraft.specialRequests} onChange={(specialRequests) => setBookingDraft((current) => current ? { ...current, specialRequests } : current)} />
                      <p className="rounded-xl bg-tertiary-container p-4 text-xs font-bold text-on-tertiary-container">Guest count cannot be changed after payment is completed. Financial totals are recalculated securely by the backend.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="bg-surface text-primary px-5 py-3 rounded-xl font-bold" onClick={() => setBookingDraft(null)} type="button">Cancel</button>
                        <button className="bg-primary text-on-primary px-5 py-3 rounded-xl font-bold disabled:opacity-70" disabled={savingBooking} onClick={saveBookingDetails} type="button">{savingBooking ? "Saving..." : "Save Details"}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <BookingDetail label="Customer" value={selectedBooking.guestName} />
                        <BookingDetail label="Email" value={selectedBooking.email} />
                        <BookingDetail label="Phone" value={selectedBooking.phone} />
                        <BookingDetail label="Experience Date" value={selectedBooking.preferredDate} />
                        <BookingDetail label="Guests" value={String(selectedBooking.guestCount)} />
                        <BookingDetail label="Amount Due" value={selectedBooking.amountDue} />
                      </div>
                      {selectedBooking.specialRequests && <BookingDetail label="Special Requests" value={selectedBooking.specialRequests} />}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <AdminSelect label="Booking Status" value={selectedBooking.bookingStatus} options={["pending", "confirmed", "cancelled", "completed"]} onChange={(value) => handleBookingStatus(selectedBooking.id, value as BookingStatus)} />
                        <AdminSelect label="Payment Status" value={selectedBooking.paymentStatus} options={["unpaid", "pending", "paid", "failed", "refunded"]} onChange={(value) => handlePaymentStatus(selectedBooking.id, value as PaymentStatus)} />
                      </div>
                    </div>
                  )}
                </article>
                </div>
              )}
              {!selectedBooking && (
                <div className="lg:col-span-7 min-h-72 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-primary text-5xl mb-4">reservation</span>
                  <h3 className="font-headline text-2xl font-black text-on-surface mb-2">Select a booking</h3>
                  <p className="text-on-surface-variant max-w-sm">Use the View Details button on a booking card to review customer, payment, and reservation information.</p>
                </div>
              )}
            </div>
          )}
        </section>}

        {activeTab === "experiences" && <section className="space-y-6">
          <div>
            <h2 className="font-headline text-3xl font-black">Packages & Prices</h2>
            <p className="text-on-surface-variant mt-2">Use one form to add or edit packages, then review them in the library beside it.</p>
          </div>

          {experienceError && <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">{experienceError}</p>}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28 bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-headline text-2xl font-black">{editingExperienceId ? "Edit Package" : "Add Package"}</h3>
                {editingExperienceId && <button className="text-primary font-bold text-sm" onClick={clearExperienceForm} type="button">Cancel Edit</button>}
              </div>
              <ImageUpload
                alt={`${experienceDraft.title || "Package"} preview`}
                key={experienceDraft.id}
                label="Cover Image"
                onUploaded={(imageUrl) => updateExperienceDraft("image", imageUrl)}
                value={experienceDraft.image}
              />
              <div className="rounded-2xl bg-surface p-4 sm:p-5 border border-outline-variant/10 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-headline text-lg font-black">Slideshow Images</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Add one or more images to cycle on the public package card.</p>
                  </div>
                  <button className="text-sm font-bold text-primary" onClick={addExperienceSlide} type="button">
                    Add Slide
                  </button>
                </div>
                <div className="space-y-4">
                  {experienceDraft.slideshowImages.map((slideImage, index) => (
                    <div className="rounded-2xl bg-surface-container-low p-3 sm:p-4 space-y-3" key={`${experienceDraft.id}-slide-${index}`}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant">Slide {index + 1}</span>
                        <button
                          className="text-xs font-bold text-primary disabled:text-on-surface-variant"
                          disabled={experienceDraft.slideshowImages.length === 1}
                          onClick={() => removeExperienceSlide(index)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                      <ImageUpload
                        alt={`${experienceDraft.title || "Package"} slide ${index + 1}`}
                        label={`Slide ${index + 1}`}
                        onUploaded={(imageUrl) => updateExperienceSlide(index, imageUrl)}
                        value={slideImage}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminField label="Title" value={experienceDraft.title} onChange={(value) => updateExperienceDraft("title", value)} />
                <div>
                  <AdminField label="Price per person" value={experienceDraft.price} onChange={(value) => updateExperienceDraft("price", value)} />
                  <p className="text-xs text-on-surface-variant mt-2 px-1">Use $0 to show Price to confirm.</p>
                </div>
                <AdminField label="Duration" value={experienceDraft.duration} onChange={(value) => updateExperienceDraft("duration", value)} />
                <AdminField label="Tag" value={experienceDraft.tag} onChange={(value) => updateExperienceDraft("tag", value)} />
              </div>
              <AdminTextarea label="Description" value={experienceDraft.description} onChange={(value) => updateExperienceDraft("description", value)} />
              <AdminTextarea label="Included Items (one per line)" value={experienceDraft.included.join("\n")} onChange={(value) => updateExperienceDraft("included", value)} />
              <button className="w-full bg-primary text-on-primary px-5 py-4 rounded-xl font-bold" onClick={submitExperience} type="button">
                {editingExperienceId ? "Update Package" : "Add Package"}
              </button>
            </div>

            <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h3 className="font-headline text-2xl font-black">Package Library</h3>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-on-surface-variant">{content.experiences.length} item{content.experiences.length === 1 ? "" : "s"}</span>
              </div>
              {content.experiences.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-5xl mb-3">explore</span>
                  <p>Added packages will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {content.experiences.map((experience, index) => (
                    <article className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border bg-surface p-3 sm:p-4 ${editingExperienceId === experience.id ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/10"}`} key={experience.id}>
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-surface-container-high">
                          {experience.image ? <img className="h-full w-full object-cover" src={experience.image} alt="" /> : <span className="material-symbols-outlined h-full w-full flex items-center justify-center text-primary">image</span>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Package {index + 1}</p>
                          <h4 className="font-headline text-lg font-black truncate">{experience.title}</h4>
                          <p className="text-sm text-on-surface-variant"><span className="font-bold text-primary">{packagePriceLabel(experience.price)}</span> · {experience.duration}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 shrink-0">
                        <button className="bg-surface-container-high text-primary px-4 py-2 rounded-lg font-bold text-sm" onClick={() => editExperience(experience)} type="button">Edit</button>
                        <button className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-bold text-sm" onClick={() => removeExperience(index)} type="button">Remove</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>}

        {activeTab === "gallery" && <GalleryManager />}

        {activeTab === "reviews" && <ReviewsManager />}

        {activeTab === "activity" && <AuditLogViewer />}

        {activeTab === "settings" && <AdminSettingsManager />}

        {activeTab !== "gallery" && activeTab !== "activity" && activeTab !== "settings" && activeTab !== "reviews" && <div className="sticky bottom-4 z-10 bg-surface/90 backdrop-blur-xl border border-outline-variant/10 rounded-2xl p-3 sm:p-4 shadow-xl flex justify-end">
          <button
            className="w-full sm:w-auto min-w-44 bg-primary text-on-primary px-8 py-4 rounded-xl font-bold uppercase text-sm disabled:opacity-70 flex items-center justify-center gap-2"
            disabled={saveStatus === "saving"}
            type="submit"
          >
            {saveStatus === "saving" && <span className="material-symbols-outlined animate-spin text-lg" aria-hidden="true">progress_activity</span>}
            {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved" : "Save Updates"}
          </button>
        </div>}
      </form>

      {saveStatus === "success" && (
        <div className="fixed bottom-24 sm:bottom-8 right-4 left-4 sm:left-auto z-50 sm:max-w-md rounded-2xl p-5 shadow-2xl border flex items-start gap-4 bg-secondary-container text-on-secondary-container border-secondary/20" role="status">
          <span className="material-symbols-outlined text-2xl" aria-hidden="true">
            check_circle
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-headline text-lg font-black mb-1">Updates saved</p>
            <p className="text-sm leading-relaxed">{saveMessage}</p>
          </div>
          <button
            aria-label="Dismiss notification"
            className="shrink-0 rounded-full p-1 hover:bg-black/5"
            onClick={() => setSaveStatus("idle")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="fixed bottom-24 sm:bottom-8 right-4 left-4 sm:left-auto z-50 sm:max-w-md rounded-2xl p-5 shadow-2xl border flex items-start gap-4 bg-red-50 text-red-800 border-red-200" role="alert">
          <span className="material-symbols-outlined text-2xl" aria-hidden="true">
            error
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-headline text-lg font-black mb-1">Save failed</p>
            <p className="text-sm leading-relaxed">{saveMessage}</p>
          </div>
          <button
            aria-label="Dismiss notification"
            className="shrink-0 rounded-full p-1 hover:bg-black/5"
            onClick={() => setSaveStatus("idle")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      )}
    </main>
  );
}

function createEmptyExperience(): SiteContent["experiences"][number] {
  return {
    ...createBlankExperience(),
    title: "",
    description: "",
    price: "",
    duration: "",
    image: "",
    tag: "",
    included: [],
  };
}

function packagePriceLabel(price: string) {
  return price === "$0" || price === "$0.00" ? "Price to confirm" : price;
}

type GalleryItem = {
  id: string;
  title: string;
  tag: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyGalleryItem: Omit<GalleryItem, "id"> = {
  title: "",
  tag: "",
  imageUrl: "",
  altText: "",
  sortOrder: 0,
  isActive: true,
};

function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [draft, setDraft] = useState(emptyGalleryItem);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest<{ gallery: GalleryItem[] }>("/api/admin/gallery", { admin: true })
      .then((result) => {
        if (active) setItems(result.gallery);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Could not load gallery images.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function updateDraft(updates: Partial<Omit<GalleryItem, "id">>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function clearForm() {
    setDraft({ ...emptyGalleryItem, sortOrder: items.length });
    setEditingId(null);
    setFormKey((current) => current + 1);
  }

  function editItem(item: GalleryItem) {
    const { id, ...editable } = item;
    setDraft(editable);
    setEditingId(id);
    setError("");
    setFormKey((current) => current + 1);
  }

  async function saveItem() {
    if (!draft.imageUrl || !draft.title.trim() || !draft.altText.trim()) {
      setError("Add an image, title, and accessible image description before saving.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const result = await apiRequest<{ item: GalleryItem }>(
        editingId ? `/api/admin/gallery/${encodeURIComponent(editingId)}` : "/api/admin/gallery",
        {
          admin: true,
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify({ item: draft }),
        },
      );
      setItems((current) => editingId
        ? current.map((entry) => entry.id === editingId ? result.item : entry)
        : [...current, result.item]);
      setDraft({ ...emptyGalleryItem, sortOrder: items.length + (editingId ? 0 : 1) });
      setEditingId(null);
      setFormKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save gallery image.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(item: GalleryItem) {
    if (!window.confirm(`Remove "${item.title || "this image"}" from the gallery?`)) return;
    try {
      await apiRequest(`/api/admin/gallery/${encodeURIComponent(item.id)}`, { admin: true, method: "DELETE" });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not remove gallery image.");
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    if (editingId === item.id) clearForm();
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-headline text-3xl font-black">Gallery Images</h2>
        <p className="text-on-surface-variant mt-2">Upload from one form, then manage published images in the library beside it.</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28 bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-headline text-2xl font-black">{editingId ? "Edit Image" : "Add Image"}</h3>
            {editingId && <button className="text-primary font-bold text-sm" onClick={clearForm} type="button">Cancel Edit</button>}
          </div>
          <ImageUpload
            alt={draft.altText || draft.title || "Gallery preview"}
            key={formKey}
            label="Gallery Image"
            onUploaded={(imageUrl) => updateDraft({ imageUrl })}
            value={draft.imageUrl}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Title" value={draft.title} onChange={(title) => updateDraft({ title })} />
            <AdminField label="Tag" value={draft.tag} onChange={(tag) => updateDraft({ tag })} />
          </div>
          <AdminTextarea label="Image Description (Alt Text)" value={draft.altText} onChange={(altText) => updateDraft({ altText })} />
          <label className="flex items-center gap-3 rounded-xl bg-surface p-4 text-sm font-bold">
            <input checked={draft.isActive} onChange={(event) => updateDraft({ isActive: event.target.checked })} type="checkbox" />
            Visible on the public gallery
          </label>
          <button className="w-full bg-primary text-on-primary px-5 py-4 rounded-xl font-bold" disabled={saving} onClick={saveItem} type="button">
            {saving ? "Saving..." : editingId ? "Save Changes" : "Publish Image"}
          </button>
        </div>

        <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-headline text-2xl font-black">Image Library</h3>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-on-surface-variant">{items.length} image{items.length === 1 ? "" : "s"}</span>
          </div>
          {loading ? (
            <div className="py-16 text-center text-on-surface-variant">Loading gallery...</div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-5xl mb-3">photo_library</span>
              <p>Published images will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => (
                <article className={`overflow-hidden rounded-2xl border bg-surface ${editingId === item.id ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/10"}`} key={item.id}>
                  <div className="aspect-[4/3] bg-surface-container-high">
                    <img className="h-full w-full object-cover" src={item.imageUrl} alt={item.altText} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <h4 className="font-headline text-lg font-black truncate">{item.title}</h4>
                        <p className="text-xs text-on-surface-variant truncate">{item.tag || "No tag"}</p>
                      </div>
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full mt-2 ${item.isActive ? "bg-green-600" : "bg-outline"}`} title={item.isActive ? "Visible" : "Hidden"} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-surface-container-high text-primary px-3 py-2 rounded-lg font-bold text-sm" onClick={() => editItem(item)} type="button">Edit</button>
                      <button className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-bold text-sm" onClick={() => removeItem(item)} type="button">Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ImageUpload({ label, value, alt, onUploaded }: { label: string; value: string; alt: string; onUploaded: (imageUrl: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 15_000_000) {
      setError("The image exceeds the 15 MB upload limit.");
      return;
    }

    setUploading(true);
    try {
      const [contentBase64, dimensions] = await Promise.all([readFile(file), readDimensions(file)]);
      const result = await apiRequest<{ imageUrl: string }>("/api/admin/uploads", {
        admin: true,
        method: "POST",
        body: JSON.stringify({ mimeType: file.type, contentBase64 }),
      });
      onUploaded(result.imageUrl);
      setDetails(`${dimensions.width} × ${dimensions.height}px · ${formatFileSize(file.size)}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    void upload(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    void upload(event.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <span className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2">{label}</span>
      <label
        className="group block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant/30 bg-surface transition-colors hover:border-primary"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="relative aspect-video bg-surface-container-high">
            <img className="h-full w-full object-cover" src={value} alt={alt} />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/45">
              <span className="rounded-xl bg-white px-5 py-3 font-bold text-primary opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                Replace Image
              </span>
            </div>
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-3">cloud_upload</span>
            <span className="font-headline text-xl font-black text-on-surface">Choose or drop an image</span>
            <span className="mt-2 text-sm text-on-surface-variant">JPEG, PNG or WebP · HD supported · Maximum 15 MB</span>
          </div>
        )}
        <input accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={handleInput} type="file" />
      </label>
      {uploading && <p className="mt-3 text-sm font-bold text-primary">Uploading high-resolution image...</p>}
      {details && !uploading && <p className="mt-3 text-xs font-bold text-on-surface-variant">Uploaded: {details}</p>}
      {error && <p className="mt-3 text-sm font-bold text-red-700" role="alert">{error}</p>}
    </div>
  );
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function readDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      reject(new Error("The selected image could not be decoded."));
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  });
}

function formatFileSize(bytes: number) {
  return bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.ceil(bytes / 1_000)} KB`;
}

export default Admin;

function AdminField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div className="flex flex-col">
      <span className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2">{label}</span>
      <input
        className="h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface"
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </div>
  );
}

function AdminSettingsManager() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleUpdate(e: React.MouseEvent) {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMessage("Current password is required to save changes.");
      setStatus("error");
      return;
    }
    if (!newEmail && !newPassword) {
      setErrorMessage("Please provide a new email or new password to update.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setErrorMessage("");
    try {
      await updateAdminSettings(currentPassword, newEmail || undefined, newPassword || undefined);
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update settings.");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary">manage_accounts</span>
        </div>
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface">Account Settings</h2>
          <p className="text-on-surface-variant text-sm">Update your admin login credentials securely.</p>
        </div>
      </div>

      {/* Alerts */}
      {status === "error" && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4" role="alert">
          <span className="material-symbols-outlined text-red-500 shrink-0 mt-0.5">error</span>
          <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
        </div>
      )}
      {status === "success" && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4" role="status">
          <span className="material-symbols-outlined text-emerald-600 shrink-0 mt-0.5">check_circle</span>
          <p className="text-sm font-semibold text-emerald-700">Credentials updated successfully! Use your new details next time you log in.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Credentials card */}
        <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10">
          <h3 className="font-bold text-on-surface mb-1">New Credentials</h3>
          <p className="text-xs text-on-surface-variant mb-5">Leave a field blank to keep it unchanged.</p>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="new-email">New Email Address</label>
              <input
                className="h-12 bg-surface border border-outline-variant/30 focus:border-primary outline-none rounded-xl px-4 text-on-surface text-sm transition-colors"
                id="new-email"
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@email.com"
                type="email"
                value={newEmail}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="new-password">New Password</label>
              <div className="relative">
                <input
                  className="w-full h-12 bg-surface border border-outline-variant/30 focus:border-primary outline-none rounded-xl px-4 pr-12 text-on-surface text-sm transition-colors"
                  id="new-password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 12 characters for production"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  onClick={() => setShowNew((v) => !v)}
                  type="button"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-xl">{showNew ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm identity card */}
        <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10">
          <h3 className="font-bold text-on-surface mb-1">Confirm Your Identity</h3>
          <p className="text-xs text-on-surface-variant mb-5">Enter your current password to authorize these changes.</p>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="current-password">Current Password</label>
              <div className="relative">
                <input
                  className="w-full h-12 bg-surface border border-outline-variant/30 focus:border-primary outline-none rounded-xl px-4 pr-12 text-on-surface text-sm transition-colors"
                  id="current-password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Your current password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  onClick={() => setShowCurrent((v) => !v)}
                  type="button"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-xl">{showCurrent ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>
            <button
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              disabled={status === "saving"}
              onClick={handleUpdate}
              type="button"
            >
              {status === "saving" ? (
                <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Saving...</>
              ) : (
                <><span className="material-symbols-outlined text-base">lock_reset</span> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 min-w-0">
      <p className="text-[11px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">{label}</p>
      <p className="font-bold text-on-surface break-words">{value || "—"}</p>
    </div>
  );
}

function AdminTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2">{label}</span>
      <textarea className="w-full bg-surface border-none rounded-xl p-4 text-on-surface resize-y min-h-28" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function AdminSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block bg-surface rounded-xl p-4">
      <span className="block text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-2">{label}</span>
      <select className="w-full bg-surface-container-high rounded-xl px-3 py-2 font-bold capitalize" onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAuditLogs()
      .then((result) => setLogs(result.logs))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load activity logs."))
      .finally(() => setLoading(false));
  }, []);

  const actionColor: Record<string, string> = {
    create: "bg-emerald-100 text-emerald-700",
    update: "bg-blue-100 text-blue-700",
    delete: "bg-red-100 text-red-700",
  };

  const actionIcon: Record<string, string> = {
    create: "add_circle",
    update: "edit",
    delete: "delete",
  };

  const entityIcon: Record<string, string> = {
    booking: "event",
    experience: "explore",
    admin_settings: "manage_accounts",
    site_settings: "settings",
    gallery: "photo_library",
    inquiry: "mail",
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">history</span>
          </div>
          <div>
            <h2 className="font-headline text-2xl sm:text-3xl font-black text-on-surface">Activity Log</h2>
            <p className="text-on-surface-variant text-sm">Chronological history of all admin actions on this platform.</p>
          </div>
        </div>
        {!loading && !error && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">database</span>
            {logs.length} record{logs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4" role="alert">
          <span className="material-symbols-outlined text-red-500 shrink-0 mt-0.5">error</span>
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface-container-high rounded w-1/3" />
                <div className="h-3 bg-surface-container-high rounded w-2/3" />
              </div>
              <div className="h-3 bg-surface-container-high rounded w-24 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-3 bg-surface-container-low rounded-2xl border border-outline-variant/10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">history_toggle_off</span>
          </div>
          <p className="font-bold text-on-surface">No activity recorded yet</p>
          <p className="text-sm text-on-surface-variant max-w-xs">Actions like creating experiences, updating bookings, and changing settings will appear here.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-outline-variant/20 hidden sm:block" />
          <div className="space-y-3">
            {logs.map((log) => {
              const action = log.action?.toLowerCase() ?? "update";
              const entity = log.entityType?.toLowerCase() ?? "";
              return (
                <article
                  key={log.id}
                  className="relative bg-surface-container-low border border-outline-variant/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start gap-3 hover:border-primary/20 transition-colors"
                >
                  {/* Icon dot */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${actionColor[action] ?? "bg-surface-container-high text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-lg">{actionIcon[action] ?? "bolt"}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${actionColor[action] ?? "bg-surface-container-high text-on-surface-variant"}`}>
                        {log.action}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined" style={{fontSize: "10px"}}>{entityIcon[entity] ?? "category"}</span>
                        {log.entityType?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface">
                      <span className="font-bold">{log.adminEmail}</span>
                    </p>
                    {log.entityId && (
                      <p className="text-xs text-on-surface-variant mt-1 font-mono truncate">
                        ID: {log.entityId}
                      </p>
                    )}
                  </div>

                  <time className="text-xs text-on-surface-variant shrink-0 sm:text-right whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StarRatingSelector({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  return (
    <div className="flex flex-col">
      <span className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2">Rating</span>
      <div className="flex items-center gap-1.5 h-14 bg-surface-container-high rounded-xl px-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl transition-transform active:scale-95 focus:outline-none flex items-center"
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: `'FILL' ${star <= value ? 1 : 0}`,
                color: star <= value ? "#eab308" : "var(--color-on-surface-variant, #6b7280)",
              }}
            >
              star
            </span>
          </button>
        ))}
        <span className="text-sm font-bold text-on-surface-variant ml-2">
          {value} Star{value > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

const emptyReviewDraft: ReviewDraft = {
  reviewerName: "",
  reviewerPhoto: "",
  experienceTitle: "",
  rating: 5,
  comment: "",
  isActive: true,
  sortOrder: 0,
};

function ReviewsManager() {
  const [items, setItems] = useState<Review[]>([]);
  const [draft, setDraft] = useState<ReviewDraft>(emptyReviewDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getAdminReviews()
      .then((result) => {
        if (active) setItems(result.reviews);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Could not load reviews.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function updateDraft(updates: Partial<ReviewDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function clearForm() {
    setDraft({ ...emptyReviewDraft, sortOrder: items.length });
    setEditingId(null);
    setFormKey((current) => current + 1);
  }

  function editItem(item: Review) {
    const { id, createdAt, updatedAt, ...editable } = item;
    setDraft(editable);
    setEditingId(id);
    setError("");
    setFormKey((current) => current + 1);
  }

  async function saveItem() {
    if (!draft.reviewerName.trim() || !draft.comment.trim()) {
      setError("Please fill in the reviewer's name and their comment.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const result = await updateReview(editingId, draft);
        setItems((current) =>
          current.map((entry) => (entry.id === editingId ? result.review : entry))
        );
      } else {
        const result = await createReview(draft);
        setItems((current) => [...current, result.review]);
      }
      setDraft({ ...emptyReviewDraft, sortOrder: items.length + (editingId ? 0 : 1) });
      setEditingId(null);
      setFormKey((current) => current + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save review.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(item: Review) {
    if (!window.confirm(`Remove review by "${item.reviewerName}"?`)) return;
    try {
      await deleteReview(item.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not remove review.");
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    if (editingId === item.id) clearForm();
  }

  const experiences = getSiteContent().experiences;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-headline text-3xl font-black">Customer Reviews</h2>
        <p className="text-on-surface-variant mt-2">
          Add real reviews/testimonials from your guests manually, including their photo.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28 bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-headline text-2xl font-black">{editingId ? "Edit Review" : "Add Review"}</h3>
            {editingId && (
              <button className="text-primary font-bold text-sm" onClick={clearForm} type="button">
                Cancel Edit
              </button>
            )}
          </div>

          <ImageUpload
            alt={draft.reviewerName || "Reviewer photo"}
            key={formKey}
            label="Reviewer Photo"
            onUploaded={(reviewerPhoto) => updateDraft({ reviewerPhoto })}
            value={draft.reviewerPhoto}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField
              label="Reviewer Name"
              value={draft.reviewerName}
              onChange={(reviewerName) => updateDraft({ reviewerName })}
            />
            <div className="flex flex-col">
              <label className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2" htmlFor="review-experience">
                Experience
              </label>
              <select
                className="h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface capitalize font-bold"
                id="review-experience"
                value={draft.experienceTitle}
                onChange={(event) => updateDraft({ experienceTitle: event.target.value })}
              >
                <option value="">General Review</option>
                {experiences.map((exp) => (
                  <option key={exp.id} value={exp.title}>
                    {exp.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <StarRatingSelector
              value={draft.rating}
              onChange={(rating) => updateDraft({ rating })}
            />
            <div className="flex flex-col">
              <span className="block text-sm font-bold text-on-surface tracking-wide px-1 mb-2">
                Display Order
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="h-14 w-14 rounded-xl bg-surface-container-high text-on-surface font-bold"
                  type="button"
                  aria-label="Move review up"
                  onClick={() => updateDraft({ sortOrder: Math.max(0, draft.sortOrder - 1) })}
                  disabled={draft.sortOrder <= 0}
                >
                  −
                </button>
                <input
                  className="h-14 flex-1 bg-surface-container-high border-none rounded-xl px-4 text-on-surface"
                  aria-label="Review display order"
                  type="number"
                  min={0}
                  value={draft.sortOrder}
                  onChange={(event) => {
                    const n = Number(event.target.value);
                    updateDraft({ sortOrder: Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0 });
                  }}
                />
                <button
                  className="h-14 w-14 rounded-xl bg-surface-container-high text-on-surface font-bold"
                  type="button"
                  aria-label="Move review down"
                  onClick={() => updateDraft({ sortOrder: draft.sortOrder + 1 })}
                >
                  +
                </button>
              </div>
              <p className="text-xs font-bold text-on-surface-variant mt-2">
                Lower number = shows earlier.
              </p>
            </div>
          </div>

          <AdminTextarea
            label="Review Text"
            value={draft.comment}
            onChange={(comment) => updateDraft({ comment })}
          />

          <label className="flex items-center gap-3 rounded-xl bg-surface p-4 text-sm font-bold">
            <input
              checked={draft.isActive}
              onChange={(event) => updateDraft({ isActive: event.target.checked })}
              type="checkbox"
            />
            Visible on the public site
          </label>

          <button
            className="w-full bg-primary text-on-primary px-5 py-4 rounded-xl font-bold"
            disabled={saving}
            onClick={saveItem}
            type="button"
          >
            {saving ? "Saving..." : editingId ? "Save Changes" : "Publish Review"}
          </button>
        </div>

        <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-headline text-2xl font-black">Published Reviews</h3>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-on-surface-variant">
              {items.length} review{items.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-on-surface-variant">Loading reviews...</div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-5xl mb-3">reviews</span>
              <p>No customer reviews published yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  className={`p-5 rounded-2xl border bg-surface flex flex-col sm:flex-row gap-4 justify-between items-start ${
                    editingId === item.id ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/10"
                  }`}
                  key={item.id}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                      {item.reviewerPhoto ? (
                        <img
                          className="h-full w-full object-cover"
                          src={item.reviewerPhoto}
                          alt={item.reviewerName}
                        />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant flex items-center justify-center h-full w-full">
                          person
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-headline text-base font-black truncate">{item.reviewerName}</h4>
                        {item.experienceTitle && (
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                            {item.experienceTitle}
                          </span>
                        )}
                        <span
                          className={`h-2 w-2 rounded-full ${item.isActive ? "bg-green-600" : "bg-outline"}`}
                          title={item.isActive ? "Visible" : "Hidden"}
                        />
                      </div>
                      <div className="flex gap-0.5 mb-2 text-[#eab308]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-lg"
                            style={{ fontVariationSettings: `'FILL' ${i < item.rating ? 1 : 0}` }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-on-surface-variant/90 font-body leading-relaxed whitespace-pre-line italic">
                        "{item.comment}"
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      className="flex-1 bg-surface-container-high text-primary px-3 py-2 rounded-lg font-bold text-xs"
                      onClick={() => editItem(item)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="flex-grow bg-red-50 text-red-700 px-3 py-2 rounded-lg font-bold text-xs"
                      onClick={() => removeItem(item)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
