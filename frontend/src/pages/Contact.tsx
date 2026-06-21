import { useState } from "react";
import type { FormEvent } from "react";
import { apiRequest } from "../data/api";
import { useSiteContent } from "../data/content";

export default function Contact() {
  const { site } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    try {
      await apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") ?? "",
          message: formData.get("message"),
        }),
      });
    } finally {
      setSubmitted(true);
    }
  }

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="mb-12 md:mb-20 text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface mb-6">Reach Out to the <span className="text-primary italic">Highlands</span></h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">Whether you're looking to book a cultural stay, an immersive forest walk, or simply want to learn more about the Bakiga heritage, our team is here to guide your journey.</p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Direct Contact & Socials (Bento Style) */}
        <div className="md:col-span-5 grid grid-cols-1 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:bg-secondary-container transition-colors duration-500">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center mb-6 text-2xl">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">WhatsApp Us</h3>
              <p className="text-on-surface-variant mb-6">Instant support for bookings and travel inquiries.</p>
            </div>
            <a className="inline-flex items-center gap-2 text-primary font-bold group-hover:text-on-secondary-container transition-colors" href={site.whatsappUrl}>
              Connect on WhatsApp
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
          {/* Email Card */}
          <div className="bg-surface-container-highest rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Email Address</h3>
              <p className="text-on-surface-variant mb-4">For detailed itineraries or partnership inquiries.</p>
              <a className="text-base sm:text-xl font-bold text-primary break-all" href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>
          {/* Office Card */}
          <div className="bg-surface-container rounded-2xl p-6 sm:p-8">
            <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">The Heritage Hub</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {site.address.map((line) => (
                <span key={line}>
                  {line}<br />
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Right Side: Map and Form/Image (Asymmetric Design) */}
        <div className="md:col-span-7 flex flex-col gap-8">
          {/* Visual Map Component */}
          <div className="h-[300px] md:h-[400px] bg-surface-container-high rounded-2xl overflow-hidden relative shadow-inner">
            <img alt="Map" className="w-full h-full object-cover grayscale brightness-75 contrast-125 opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyVtmypgYhiTyfNMsVg_8evNryA7pFl8nWMZdLtm8MJGUjhLJgxYPuPB8xJmKXq7pVqhSU7yD1BCOlYhGV4f2H6zvFv3mpT35frSi3-1ATEe5RbJZH2ffcJiH8S09oK1_WOaDWb3zcFRp0Bc-rn8yjhxSbqKOt06hB8gxHDtfkV3TrYomx3imNq8z3QD_l-dS5FyPFl-SVq0DZleOzsQKqXdlA6Lbq5PoqGif62zBkpUB9ucdJ9LlNdSQ3mcOlnb9mE9zeYyLUDiM" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-surface p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 border border-outline-variant/10 text-center sm:text-left">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined">home_pin</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Ekika Cultural Experience Center</p>
                    <p className="text-xs text-on-surface-variant">{site.locationLabel}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute bottom-6 left-6 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold tracking-widest text-primary uppercase">
              Kigezi Highlands
            </div>
          </div>
          {/* Secondary Image/Story Element */}
          <div className="bg-surface-container-low rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center border border-outline-variant/10 text-center md:text-left">
            <img alt="Caretaker" className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] object-cover shadow-xl rotate-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMSftRx9VhJzMow0emarTrWckjz43g872tl6aJx3MOhicvx_0Vt36UAkmpNNrzB0kyTZlb1AQtAzPdcv7NL5v708FUbhg7EcQm9xMdWUvbBYPQalFITbk1ewzUKY7udiC5muY6Z7QhBI_H_4JLqc0oK3Y7LUsRSCq0Y6Smvv-zs2OgWMB_kqKxc97QgCWWgduQ4W4kO_qbnhiqX-MOX1LF9aDS2cQd3sPhIgw3znCTm0r2XWql733fKLJEX8cBKjsYpiR8vG6NQt0" />
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-3 italic">"We welcome you as family, not just visitors."</h4>
              <p className="text-on-surface-variant leading-relaxed">Our local hosts are ready to share stories that have been passed down through generations. Connect with us to begin your journey.</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-8 md:p-10 border border-outline-variant/10">
            {submitted && (
              <div className="mb-6 rounded-2xl bg-secondary-container text-on-secondary-container p-5 flex items-start gap-3">
                <span className="material-symbols-outlined">check_circle</span>
                <p className="text-sm leading-relaxed">
                  Your message is ready. Send it through your email app, or reach us directly on WhatsApp for faster replies.
                </p>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface tracking-wide px-1">FULL NAME</label>
                  <input className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface" name="name" placeholder="Your name" type="text" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface tracking-wide px-1">EMAIL ADDRESS</label>
                  <input className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface" name="email" placeholder="you@example.com" type="email" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface tracking-wide px-1">MESSAGE</label>
                <textarea className="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface resize-none" name="message" placeholder="Tell us what kind of experience you are planning..." rows={4} required></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="w-full sm:w-auto bg-primary text-on-primary px-7 py-4 rounded-xl font-bold uppercase text-sm" type="submit">
                  Prepare Message
                </button>
                <a className="inline-flex w-full sm:w-auto justify-center bg-surface-container-high text-primary px-7 py-4 rounded-xl font-bold uppercase text-sm" href={`mailto:${site.email}`}>
                  Open Email
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
