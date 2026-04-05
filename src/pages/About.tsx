export default function About() {
  return (
    <main className="pt-36 md:pt-64">
      {/* Hero Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label text-sm font-semibold mb-6">OUR HERITAGE</span>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-extrabold text-on-surface mb-8 leading-[1.1] tracking-tight">Roots that Run as Deep as the <span className="text-primary italic">Kigezi Terraces</span></h1>
            <p className="font-body text-xl text-on-surface-variant leading-relaxed max-w-lg">
              We don't just guide tours; we share the living breath of our ancestors. Welcome to the Ekika Cultural Experience, where every hill tells a story.
            </p>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTMPL4XpqkDGSbhxd9w5buJ71zObqahky9_OAIzFbkswjqEKWTgO6-8E1_XvCcHAuD85IJYIJebRhoxm06jVSBnnZj0WduVNY-k6r7yCadPSGzm8Dw839G-YwcbmnI96BPgYodTC8YRd1C-fzfOSMGJY87V8WST3P8TXIWKcM5GzuSb_ZJ7OxVqCxFj6v6zWT5tBI32byZBTOlTouscoMFH-UnunddzHQxT-MfLHYo89jvvQC9GP645cIsyZZ73DrwVTkn8Bj56ZM" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-6 rounded-xl shadow-lg max-w-[240px] hidden md:block">
              <p className="font-headline font-bold text-primary text-2xl mb-1">2,500m</p>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest font-bold">Above Sea Level</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Spirit of Kigezi */}
      <section className="bg-surface-container-low py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface mb-6 uppercase">The Spirit of Kigezi</h2>
              <p className="font-body text-lg text-on-surface-variant leading-loose">
                In the southwestern reaches of Uganda lies a land defined by its resilience. The Bakiga people, or "the people of the mountains," have carved a life out of the steep slopes for centuries. Our culture is woven from the strength of these hills and the warmth of the highland fire.
              </p>
            </div>
            <div className="flex items-center gap-4 border-l-4 border-primary pl-6">
              <span className="material-symbols-outlined text-4xl text-primary">landscape</span>
              <p className="font-label text-on-surface font-bold text-sm leading-tight">THE SWITZERLAND<br />OF AFRICA</p>
            </div>
          </div>
          {/* Bento Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-8 bg-surface rounded-xl overflow-hidden relative group">
              <img className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7966SouRc5zHc0oFnseCvOV7vUuvMV7AE3cDz6qmC0AzSDlh1dBIl7i0znUREFlVRqMCj3JLtkLDCWqGjOmUB2KxtEjTPQQcIxQxRAIEqjHx5AEHqPgvPtmBPgS33HQ0Dm_wPvGkqjRcBt_NlxhUNi5KjY-nU9Du3sEfXpawiYH5uvFFToHbKMqaN_efTrcyzWR5v2lQNnKcjVoqmtbGHKDmXSmBXx4DB_heV8dVnLpErzsFp3PNE04YUcLfDPdlTX02tY410dVQ" />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent flex flex-col justify-end p-10">
                <h3 className="font-headline text-white text-3xl font-bold mb-2">The Energetic Ekizino</h3>
                <p className="text-white/80 font-body max-w-md">Our signature dance, where the rhythmic thumping of feet mimics the strength required to cultivate the mountain sides.</p>
              </div>
            </div>
            <div className="md:col-span-4 grid grid-rows-2 gap-6">
              <div className="bg-surface-container-highest rounded-xl p-8 flex flex-col justify-center">
                <span className="material-symbols-outlined text-tertiary text-4xl mb-4">water_drop</span>
                <h4 className="font-headline text-xl font-bold mb-2 text-on-surface">The Sacred Waters</h4>
                <p className="font-body text-sm text-on-surface-variant">Lake Bunyonyi, the "Place of Little Birds," serves as our spiritual and physical anchor, home to 29 historical islands.</p>
              </div>
              <div className="bg-primary rounded-xl overflow-hidden relative">
                <img className="w-full h-full object-cover opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYEGiW1pbNRkLkRUWbhQrpy4zWX4l6YW94qOa4BzE6rEM4HEfHnC0qhO_EFM_IKbJzWAETPVvln-gGbBNRwKkqeiJ0WYbadAtNzOP7a9tZBpmSD6u3NTQGwwK9CJn2VKpcO_Q6jxMIFfwcjTQ1IeXsIOXWP6JIC_MJKVkgtGOlgdNtaOonUu6wwNeNolN5yp_b4c06hCBnabKv_7uNBGM3Jw9JdhgYL6cOErMJThibw0Dran72cSMUQiYAalJKhK4MckjoG1pgSvo" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <span className="material-symbols-outlined text-white text-5xl mb-4">texture</span>
                  <h4 className="font-headline text-white text-2xl font-bold">Woven History</h4>
                  <p className="text-white/80 font-body text-sm mt-2">Every pattern in our baskets is a syllable in a story of community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey of the Founder */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-fixed-dim rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="rounded-2xl overflow-hidden aspect-square shadow-2xl ring-8 ring-surface-container">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAIODs1HIj148NnDw7phZTvpxzx45eEclj4JfEmGlKlBeijJ7ZeOWrnjYxtF4HLMbM5rna-2_myeK4UvCa1vqnEFPwE7XJkK47uC8h_-O6rlWzrgBLpsqqmhfGdTgrmwNn6QO4GRqKQeVnZ18EhLGNWBvD04lkDuyWV5V39glZn4FukPe0krk2NnLEbrL-wFPNK5UrJCpN477kmzIOBtNiN0jARqOda777i8LQzDnJoCt4F-U1cpW36FCDgjzI13dUPmufpHPpch4" />
            </div>
            <div className="mt-8 lg:absolute lg:-bottom-10 lg:right-10 bg-surface p-6 md:p-8 rounded-xl shadow-xl border border-outline-variant/20 max-w-sm relative z-10 mx-4 lg:mx-0">
              <p className="font-body italic text-on-surface-variant text-base md:text-lg leading-relaxed text-center lg:text-left">
                "I didn't want to build a business. I wanted to build a bridge back to our ancestors for every traveler who walks our hills."
              </p>
              <div className="mt-4 flex items-center justify-center lg:justify-start gap-3">
                <div className="h-[1px] w-8 bg-primary"></div>
                <p className="font-headline font-bold text-on-surface text-sm md:text-base">Tumusiime Brian, Founder</p>
              </div>
            </div>
          </div>
          <div>
            <span className="font-label text-primary font-bold uppercase tracking-widest text-sm mb-4 block">The Journey of the Founder</span>
            <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface mb-8 leading-tight">From Highland Soil to <span className="text-primary">Cultural Custodian</span></h2>
            <div className="space-y-6 font-body text-on-surface-variant text-lg">
              <p>Raised in the small village of Kitumba, Brian spent his childhood climbing the terraced hills, listening to the elders recount the migrations of the Bakiga from the Rwanda plains into these defensive heights.</p>
              <p>After seeing the modern world, Brian realized that the true wealth of Kigezi wasn't in its resources, but in its stories. He founded <span className="text-primary font-bold">Ekika Cultural Experience</span> with a single mission: to preserve the authentic highland lifestyle while providing sustainable livelihoods for his community.</p>
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="p-6 bg-surface-container rounded-xl">
                  <p className="font-headline text-3xl font-black text-primary mb-1">15+</p>
                  <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Community Artisans Supported</p>
                </div>
                <div className="p-6 bg-surface-container rounded-xl">
                  <p className="font-headline text-3xl font-black text-primary mb-1">100%</p>
                  <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Authentic Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-inverse-surface rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
              <path className="text-primary" d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="font-headline text-4xl md:text-6xl font-black text-inverse-on-surface mb-8 relative z-10">Ready to walk the <br /><span className="text-primary-fixed-dim italic">Highland trails?</span></h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center relative z-10">
            <button className="bg-primary hover:bg-primary-container text-white px-10 py-5 rounded-full font-label font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:-translate-y-1">
              View Our Experiences
            </button>
            <button className="bg-transparent border-2 border-outline-variant text-inverse-on-surface hover:bg-white/5 px-10 py-5 rounded-full font-label font-bold uppercase tracking-widest text-sm transition-all">
              Contact Brian
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
