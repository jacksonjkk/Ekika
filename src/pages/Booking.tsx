export default function Booking() {
  return (
    <main className="pt-36 md:pt-64 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Side: Editorial Context & Visuals */}
        <div className="lg:col-span-5 space-y-12">
          <header className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-bold tracking-widest uppercase">Reserve Experience</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-on-background leading-[1.1] tracking-tighter">Secure Your Place at the Griot’s Hearth.</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">Join us in the misty highlands of Kabale. Every booking supports local artisans and preserves the ancestral traditions of the Bakiga people.</p>
          </header>
          {/* Asymmetric Image Placement */}
          <div className="relative group">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl shadow-primary/10">
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
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[32px] shadow-2xl shadow-primary/5 border border-outline-variant/10">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface tracking-wide px-1">SELECT EXPERIENCE</label>
                  <select className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest transition-colors appearance-none cursor-pointer">
                    <option>The Highland Trail & Storytelling</option>
                    <option>Traditional Weaving Workshop</option>
                    <option>Farm-to-Table Kiga Feast</option>
                    <option>Full Immersion: 3-Day Retreat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface tracking-wide px-1">NUMBER OF GUESTS</label>
                  <div className="relative">
                    <input className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all" max="20" min="1" placeholder="2" type="number" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">group</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface tracking-wide px-1">PREFERRED DATE</label>
                <div className="relative">
                  <input className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all" type="date" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">calendar_today</span>
                </div>
              </div>
              <div className="h-px bg-surface-container-high"></div>
              <div className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight text-on-background">Your Contact Details</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-on-surface tracking-wide px-1">FULL NAME</label>
                    <input className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all" placeholder="Abebe Bikila" type="text" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface tracking-wide px-1">EMAIL ADDRESS</label>
                      <input className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all" placeholder="traveler@world.com" type="email" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-on-surface tracking-wide px-1">PHONE NUMBER</label>
                      <input className="w-full h-14 bg-surface-container-high border-none rounded-xl px-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all" placeholder="+256 --- --- ---" type="tel" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface tracking-wide px-1">DIETARY REQUIREMENTS / SPECIAL REQUESTS</label>
                <textarea className="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface focus:ring-0 focus:bg-surface-container-lowest focus:border-b-2 focus:border-primary transition-all resize-none" placeholder="Tell us about any preferences or needs..." rows={3}></textarea>
              </div>
              <div className="pt-4">
                <button className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold text-lg tracking-widest uppercase shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
                  <span>Confirm Booking</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-4 leading-relaxed">By confirming, you agree to our Traveler Safety guidelines and Terms of Service. A representative will contact you within 24 hours to finalize details.</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Experience Cards (Contextual Discovery) */}
      <section className="mt-24 pt-24 border-t border-outline-variant/10">
        <div className="mb-16 space-y-4 text-center md:text-left">
          <h2 className="text-4xl font-bold tracking-tighter text-on-surface">Curated Highland Experiences</h2>
          <p className="text-on-surface-variant max-w-2xl">Discover the stories woven into every hill. Choose the journey that speaks to your spirit.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface rounded-2xl overflow-hidden group shadow-sm border border-outline-variant/5">
            <div className="aspect-video overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrOTCpVpFDq4-Uu3TNfrx8hGAT598HkTbmwoi3QGX4wXahkP2CRrgQTDSXRCMIL801r3fQx-rC6lUXFPkj3m4Vf-X0U9UiVJ6mdCMiXSpKl_E-4Tee3dIst6htkq8WWHcTAKJ6ludoInOg0LY_5NXszOX3-wUfscn-UI3gWP56olTkEZmvNwbRe4kVXPZRKvujdOngbYjqG_0aV-dUk3qBDRB1leXWkrURpGKhgBam3vENidZDR8iS4l7ynNo8R_F0EAg36_9S8aI" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold">The Highland Trail</h3>
              <p className="text-on-surface-variant text-sm">A 4-hour guided hike through the terraced hills with deep ancestral storytelling.</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-primary font-bold">$45 / person</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-2xl overflow-hidden group shadow-sm border border-outline-variant/5">
            <div className="aspect-video overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEZ0CgBY5BgeDhY8pF2m7eC4BSWa8K9fesmACxzZ3gozkIE7bCW8mZpbAC-2TyJkdhQsP3a71htyGghmkHaFQbZ_3fnxjwp-VCXQmbM3nbxHaURyKmHvSRqEudofJK5VlamaFlmfwWON9WTCAyotP3TAZotEPGjbCHLh0BsS6LBU0V9ut4dUL9GcVLpSZrA1aHHE-5Op6FzcSGfFQ4CLFjNuMC8pYIdgxgCS7oX1XeWpN782Br05ZexLRE7nPweP6_-Ppv_xFKhHw" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Weaving Workshop</h3>
              <p className="text-on-surface-variant text-sm">Learn the rhythmic art of basketry from local master weavers in the heart of the village.</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-primary font-bold">$30 / person</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-2xl overflow-hidden group shadow-sm border border-outline-variant/5">
            <div className="aspect-video overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCptV9m1ZAbyOT744dssTOV6xTZPwszUoiW9l8B2VWhr377fcoOK8IDzBoL4_WeCTxOGKqAXwyQhJv4HdX_7KseZi5y4IXJDypIwAj4gMzjptfqJnA8K1SRBr80DXYT3wmrKSTZt7yDG0MESFONIC24PGI4Q0DTSUjEWu4y3ptHknry-2SgaLUyQvyKNXHKU3-toJT-DxM0NaxLGmAEqSSbYe5sdsX-zjxR_0oFUVrjFoI-nti65IZnhDwwjspF9AUVoexsg_7SRm8" />
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold">Kiga Feast</h3>
              <p className="text-on-surface-variant text-sm">An authentic farm-to-table culinary journey featuring ancestral recipes and organic highland produce.</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-primary font-bold">$55 / person</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
