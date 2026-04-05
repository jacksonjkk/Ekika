export default function Experiences() {
  const experiences = [
    {
      title: "Traditional Games",
      description: "Test your agility and strength with authentic Kiga sports, from wrestling to traditional target throwing.",
      price: "$20",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQQOa1V3l9rh9DrmmIH-g20B5CFV_Git0PETHxXW-fhnwRHdVmmJ2TArZFaZ7YOGy28335aiQxay2CnWeaVnbyX4zoGW2DJjH12ydp_lc9kAwWpwgqasnhZKfJHO3OT4YF_-HDDIxAtBuFZCaPaAga8yWHn4VeoVO40o8TkSQHuYkLDLLIiwCer6xwDBOzq98eZurNV5HUE7GI9s-HDQTR9PQI-uFtrk9AHsguHbjg6egw8uteO3MOFbKIr2N6JsZE_BpZt76_mSY",
      tag: "Active"
    },
    {
      title: "Ekika Dressing & Attire",
      description: "Learn the symbolism behind our traditional skins and beads. Includes a portrait session in full attire.",
      price: "$35",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzag7VJw_-fg_tK1fZBJ9eqTQr60G0a8LaHgsfm8kLZDplro_-sYStc5T6Y8tQmVq4bed1CL44nkYIn3uJdoe9ahV0p3rs0WJHTKso49-6cYCLuD2h7D8h6qDJWsqIzNTCZ1Yuqc5wql_C4ikAKjOvsSCqVbOhcnOdk068K2vTctcJURUTlHSVD3PWCoCKuB2Q_unpv7QPgzewqjjGVKIrCXGvpdEPkKYLraNPM9HQrhpP1bgN8BFtMmSQ4KiWsomTKMlNFDm9F08",
      tag: null
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
      <header className="relative pt-36 md:pt-64 pb-20 overflow-hidden">
        <div className="flex flex-col items-start gap-6">
          <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
            Curated Journeys
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface leading-[1.1] max-w-4xl tracking-tighter">
            Immersion into the <br />
            <span className="text-primary italic">Heart of Kigezi</span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
            Discover the traditions, tastes, and stories of the Bakiga people through our carefully crafted cultural packages.
          </p>
        </div>
        <div className="absolute -right-20 top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      </header>

      {/* Main Experience Card */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20">
        <div className="md:col-span-8 group relative overflow-hidden rounded-[2rem] bg-surface-container aspect-[16/9] md:aspect-auto">
          <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs1DwY3lmZUoGlvfZoINxau6S8Hz3Jj4HzIKgdzDst0dK9yx6I3KYH4Sc6hc0TPTdshhegVCwf2rQoxzWSSj3YjHuhnEXn4LP_vLwV3Q9w5mxyOkU-6l3qvbxDGUjnihHA3X52eD_meCbolk9HjaYb6AynB3_GnGJ0qGjJoQpDCrUf8uDNzuP5MD7wwoy_qjyBu2tMysDL0kcWULW1AvuduuLGKS9YY1jIZBDmMW_VWxmOjtx3ldzzC3SeDgFOLrzrRqbL7j7QVA0" />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary-fixed">restaurant</span>
              <span className="text-primary-fixed font-bold tracking-widest uppercase text-xs">Most Popular</span>
            </div>
            <h2 className="text-white font-headline text-3xl md:text-5xl font-black mb-4">Cultural Food Tasting & Cooking Lessons</h2>
            <p className="text-white/80 font-body text-lg max-w-xl mb-8">Master the art of preparing traditional millet bread (Oburo) and enjoy the rich, earthy flavors of our highland soil.</p>
            <div className="flex items-center gap-8">
              <div className="text-white">
                <span className="block text-xs uppercase opacity-60 tracking-widest font-bold">From</span>
                <span className="text-2xl font-black">$45<span className="text-sm font-normal opacity-70"> / person</span></span>
              </div>
              <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-black/20 hover:bg-primary-fixed transition-colors">
                Book Experience
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Feature Card */}
        <div className="md:col-span-4 bg-surface-container-highest rounded-[2rem] p-10 flex flex-col justify-between kiga-pattern">
          <div>
            <span className="material-symbols-outlined text-tertiary text-4xl mb-6">theater_comedy</span>
            <h3 className="text-on-surface font-headline text-3xl font-black mb-4">Story Telling Sessions</h3>
            <p className="text-on-surface-variant font-body leading-relaxed">Gather around the evening embers as elders recount legends of the ancestors and the spirits of the mountains.</p>
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant/30">
              <span className="font-bold text-on-surface">Duration: 2 Hours</span>
              <span className="text-primary font-black text-xl">$25</span>
            </div>
            <button className="w-full text-primary font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 group">
              Secure Spot 
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid of Experiences */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {experiences.map((exp, idx) => (
          <article key={idx} className="bg-surface-container-low rounded-[2rem] overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={exp.image} alt={exp.title} />
              {exp.tag && (
                <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-primary tracking-widest uppercase shadow-sm">{exp.tag}</div>
              )}
            </div>
            <div className="p-8">
              <h4 className="font-headline text-2xl font-black text-on-surface mb-3">{exp.title}</h4>
              <p className="text-on-surface-variant mb-8 line-clamp-2">{exp.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-black text-xl">{exp.price}</span>
                <button className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </article>
        ))}

        {/* Highlight Package */}
        <article className="bg-tertiary-container text-on-tertiary-container rounded-[2rem] overflow-hidden group relative">
          <div className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-on-tertiary-container/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">star_rate</span>
              </div>
              <h4 className="font-headline text-3xl font-black mb-3">Full Cultural Day Package</h4>
              <p className="opacity-80 mb-6">The definitive Kigezi journey. Includes all activities plus a traditional banquet and highland trekking.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm font-bold">
                  <span className="material-symbols-outlined text-sm">check_circle</span> 8 Hours of Immersion
                </li>
                <li className="flex items-center gap-2 text-sm font-bold">
                  <span className="material-symbols-outlined text-sm">check_circle</span> Traditional Lunch Included
                </li>
                <li className="flex items-center gap-2 text-sm font-bold">
                  <span className="material-symbols-outlined text-sm">check_circle</span> Professional Photography
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black">$120</span>
                <span className="opacity-60 text-sm mb-1 font-bold">/ full day</span>
              </div>
              <button className="w-full bg-on-tertiary-container text-tertiary-container py-4 rounded-xl font-black tracking-widest uppercase hover:opacity-90 transition-opacity">
                Book Full Day
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Location/CTA Section */}
      <section className="bg-surface-container-low py-32 mt-20 -mx-6 md:-mx-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="rounded-[2.5rem] overflow-hidden h-[500px] shadow-2xl relative">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUF5Q0elMs1ZTJ_ulIBlxqFQbruH-KrYah0t-NagmCbAKI3N-YwphzPXuoqk9f90lafZpEGhv0rzw6u8ZWS13EV1IihaKToXHxsvdk3LBsQpD09L0syToSfhChPjkBE2K017w8LT70bi9JpAV24K3ixguF0wZTFnEduYtyKw7Ma6OijuRIA2Un-TUEwi2h2787Q-DNlT2nVSENhIlg-my0eoSjl_vdcgzgLTdnm2q2oD6wxepoESsiuq7D2Z4s6q0IPkdqrTqmmIY" />
              <div className="absolute bottom-6 left-6 right-6 bg-surface p-6 rounded-2xl shadow-xl backdrop-blur-md bg-opacity-90">
                <p className="font-headline font-bold text-on-surface">Find us in the Highlands</p>
                <p className="text-on-surface-variant text-sm">Kabale District, Kigezi Region, Uganda</p>
              </div>
            </div>
            <div>
              <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface mb-8 leading-tight">Can't decide? Let us build your <span className="text-primary">Perfect Day.</span></h2>
              <p className="text-lg text-on-surface-variant mb-12 leading-relaxed">
                We offer customized itineraries for groups, researchers, and solo travelers looking for a deeper connection with the Bakiga heritage.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container">call</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">Call our Cultural Guides</h5>
                    <p className="text-sm opacity-70">+256 (0) 700 000 000</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container">mail</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">Inquire via Email</h5>
                    <p className="text-sm opacity-70">hello@ekikaexperience.ug</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
