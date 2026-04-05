export default function Contact() {
  return (
    <main className="pt-36 md:pt-64 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="mb-20 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black text-on-surface mb-6 tracking-tighter">Reach Out to the <span className="text-primary italic">Highlands</span></h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">Whether you're looking to book a cultural stay, an immersive forest walk, or simply want to learn more about the Bakiga heritage, our team is here to guide your journey.</p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Direct Contact & Socials (Bento Style) */}
        <div className="md:col-span-5 grid grid-cols-1 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-surface-container-low rounded-[32px] p-8 flex flex-col justify-between group hover:bg-secondary-container transition-colors duration-500">
            <div>
              <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center mb-6 text-2xl">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">WhatsApp Us</h3>
              <p className="text-on-surface-variant mb-6">Instant support for bookings and travel inquiries.</p>
            </div>
            <a className="inline-flex items-center gap-2 text-primary font-bold group-hover:text-on-secondary-container transition-colors" href="https://wa.me/256000000000">
              Connect on WhatsApp
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
          {/* Email Card */}
          <div className="bg-surface-container-highest rounded-[32px] p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Email Address</h3>
              <p className="text-on-surface-variant mb-4">For detailed itineraries or partnership inquiries.</p>
              <p className="text-xl font-bold text-primary">hello@ekikaexperience.ug</p>
            </div>
          </div>
          {/* Office Card */}
          <div className="bg-surface-container rounded-[32px] p-8">
            <div className="w-12 h-12 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">The Heritage Hub</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Kabale-Lake Bunyonyi Road,<br />
              Kigezi Highlands, South Western Uganda<br />
              P.O. Box 42, Kabale
            </p>
          </div>
        </div>

        {/* Right Side: Map and Form/Image (Asymmetric Design) */}
        <div className="md:col-span-7 flex flex-col gap-8">
          {/* Visual Map Component */}
          <div className="h-[400px] bg-surface-container-high rounded-[48px] overflow-hidden relative shadow-inner">
            <img alt="Map" className="w-full h-full object-cover grayscale brightness-75 contrast-125 opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyVtmypgYhiTyfNMsVg_8evNryA7pFl8nWMZdLtm8MJGUjhLJgxYPuPB8xJmKXq7pVqhSU7yD1BCOlYhGV4f2H6zvFv3mpT35frSi3-1ATEe5RbJZH2ffcJiH8S09oK1_WOaDWb3zcFRp0Bc-rn8yjhxSbqKOt06hB8gxHDtfkV3TrYomx3imNq8z3QD_l-dS5FyPFl-SVq0DZleOzsQKqXdlA6Lbq5PoqGif62zBkpUB9ucdJ9LlNdSQ3mcOlnb9mE9zeYyLUDiM" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-surface p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-outline-variant/10">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined">home_pin</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Ekika Cultural Experience Center</p>
                    <p className="text-xs text-on-surface-variant">Lake Bunyonyi Region</p>
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
          <div className="bg-surface-container-low rounded-[48px] p-10 flex flex-col md:flex-row gap-8 items-center border border-outline-variant/10">
            <img alt="Caretaker" className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] object-cover shadow-xl rotate-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMSftRx9VhJzMow0emarTrWckjz43g872tl6aJx3MOhicvx_0Vt36UAkmpNNrzB0kyTZlb1AQtAzPdcv7NL5v708FUbhg7EcQm9xMdWUvbBYPQalFITbk1ewzUKY7udiC5muY6Z7QhBI_H_4JLqc0oK3Y7LUsRSCq0Y6Smvv-zs2OgWMB_kqKxc97QgCWWgduQ4W4kO_qbnhiqX-MOX1LF9aDS2cQd3sPhIgw3znCTm0r2XWql733fKLJEX8cBKjsYpiR8vG6NQt0" />
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-3 italic">"We welcome you as family, not just visitors."</h4>
              <p className="text-on-surface-variant leading-relaxed">Our local hosts are ready to share stories that have been passed down through generations. Connect with us to begin your journey.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
