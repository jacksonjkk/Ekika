import { Link } from "react-router-dom";
import { useSiteContent } from "../data/content";
import { bookingPath } from "../data/site";

export default function Experiences() {
  const { site, experiences } = useSiteContent();
  const [featured, sideFeature, ...cardExperiences] = experiences;
  const highlight = cardExperiences.length > 2 ? cardExperiences[cardExperiences.length - 1] : undefined;
  const regularExperiences = highlight ? cardExperiences.slice(0, -1) : cardExperiences;

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pb-20 md:pb-32">
      <header className="relative pt-28 sm:pt-36 lg:pt-48 pb-12 md:pb-20 overflow-hidden">
        <div className="flex flex-col items-start gap-6">
          <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
            Curated Journeys
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface leading-[1.1] max-w-4xl">
            Immersion into the <br />
            <span className="text-primary italic">Heart of Kigezi</span>
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Discover the traditions, tastes, and stories of the Bakiga people through our carefully crafted cultural packages.
          </p>
        </div>
        <div className="absolute -right-20 top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      </header>

      {experiences.length === 0 && (
        <section className="bg-surface-container-low rounded-[2rem] p-10 md:p-16 text-center mb-20">
          <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface mb-4">
            Experiences are being updated.
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto mb-8">
            Our team is refreshing the cultural packages. Contact us to build a custom visit while the list is being prepared.
          </p>
          <Link to="/contact" className="inline-flex bg-primary text-on-primary px-8 py-4 rounded-xl font-bold uppercase tracking-widest">
            Contact Us
          </Link>
        </section>
      )}

      {/* Main Experience Card */}
      {featured && <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-14 md:mb-20">
        <div className="md:col-span-8 group relative overflow-hidden rounded-2xl bg-surface-container min-h-[520px] sm:min-h-[480px] md:min-h-[500px]">
          <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={featured.image} alt={featured.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-5 sm:p-8 md:p-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary-fixed">restaurant</span>
              <span className="text-primary-fixed font-bold tracking-widest uppercase text-xs">{featured.tag}</span>
            </div>
            <h2 className="text-white font-headline text-2xl sm:text-3xl md:text-5xl font-black mb-4">{featured.title}</h2>
            <p className="text-white/90 font-body text-sm sm:text-base md:text-lg max-w-xl mb-6 md:mb-8">{featured.description}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <div className="text-white">
                <span className="block text-xs uppercase opacity-60 tracking-widest font-bold">From</span>
                <span className="text-2xl font-black">{featured.price}<span className="text-sm font-normal opacity-70"> / person</span></span>
              </div>
              <Link to={bookingPath(featured.title)} className="w-full sm:w-auto text-center bg-white text-primary px-6 sm:px-8 py-4 rounded-lg font-bold text-sm uppercase shadow-xl shadow-black/20 hover:bg-primary-fixed transition-colors">
                Book Experience
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Feature Card */}
        {sideFeature && <div className="md:col-span-4 bg-surface-container-highest rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between kiga-pattern">
          <div>
            <span className="material-symbols-outlined text-tertiary text-4xl mb-6">theater_comedy</span>
            <h3 className="text-on-surface font-headline text-3xl font-black mb-4">{sideFeature.title}</h3>
            <p className="text-on-surface-variant font-body leading-relaxed">{sideFeature.description}</p>
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant/30">
              <span className="font-bold text-on-surface">Duration: {sideFeature.duration}</span>
              <span className="text-primary font-black text-xl">{sideFeature.price}</span>
            </div>
            <Link to={bookingPath(sideFeature.title)} className="w-full text-primary font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 group">
              Secure Spot 
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
            </Link>
          </div>
        </div>}
      </section>}

      {/* Grid of Experiences */}
      {regularExperiences.length > 0 && <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {regularExperiences.map((exp) => (
          <article key={exp.id} className="bg-surface-container-low rounded-2xl overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={exp.image} alt={exp.title} />
              {!!exp.tag && (
                <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-primary tracking-widest uppercase shadow-sm">{exp.tag}</div>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <h4 className="font-headline text-2xl font-black text-on-surface mb-3">{exp.title}</h4>
              <p className="text-on-surface-variant mb-8 line-clamp-2">{exp.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-black text-xl">{exp.price}</span>
                <Link to={bookingPath(exp.title)} className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-lg shadow-primary/20" aria-label={`Book ${exp.title}`}>
                  <span className="material-symbols-outlined">add</span>
                </Link>
              </div>
            </div>
          </article>
        ))}

        {/* Highlight Package */}
        {highlight && <Link to={bookingPath(highlight.title)} className="bg-tertiary-container text-on-tertiary-container rounded-2xl overflow-hidden group relative block hover:opacity-95 transition-opacity">
          <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-on-tertiary-container/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">star_rate</span>
              </div>
              <h4 className="font-headline text-3xl font-black mb-3">{highlight.title}</h4>
              <p className="opacity-80 mb-6">{highlight.description}</p>
              <ul className="space-y-3 mb-8">
                {highlight.included.map((item) => (
                  <li className="flex items-center gap-2 text-sm font-bold" key={item}>
                    <span className="material-symbols-outlined text-sm">check_circle</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black">{highlight.price}</span>
                <span className="opacity-60 text-sm mb-1 font-bold">/ {highlight.duration}</span>
              </div>
              <span className="block text-center w-full bg-on-tertiary-container text-tertiary-container py-4 rounded-xl font-black tracking-widest uppercase group-hover:opacity-90 transition-opacity">
                Book Full Day
              </span>
            </div>
          </div>
        </Link>}
      </section>}

      {/* Location/CTA Section */}
      <section className="bg-surface-container-low py-16 md:py-24 mt-16 md:mt-20 -mx-5 sm:-mx-8 md:-mx-12 px-5 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="rounded-2xl overflow-hidden h-[360px] sm:h-[440px] md:h-[500px] shadow-2xl relative">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUF5Q0elMs1ZTJ_ulIBlxqFQbruH-KrYah0t-NagmCbAKI3N-YwphzPXuoqk9f90lafZpEGhv0rzw6u8ZWS13EV1IihaKToXHxsvdk3LBsQpD09L0syToSfhChPjkBE2K017w8LT70bi9JpAV24K3ixguF0wZTFnEduYtyKw7Ma6OijuRIA2Un-TUEwi2h2787Q-DNlT2nVSENhIlg-my0eoSjl_vdcgzgLTdnm2q2oD6wxepoESsiuq7D2Z4s6q0IPkdqrTqmmIY" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-surface p-4 sm:p-6 rounded-xl shadow-xl backdrop-blur-md bg-opacity-90">
                <p className="font-headline font-bold text-on-surface">Find us in the Highlands</p>
                <p className="text-on-surface-variant text-sm">{site.locationLabel}</p>
              </div>
            </div>
            <div>
              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-on-surface mb-6 md:mb-8 leading-tight">Can't decide? Let us build your <span className="text-primary">Perfect Day.</span></h2>
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
                    <a className="text-sm opacity-70 hover:text-primary" href={site.phoneHref}>{site.phoneDisplay}</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container">mail</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface">Inquire via Email</h5>
                    <a className="text-sm opacity-70 hover:text-primary break-all" href={`mailto:${site.email}`}>{site.email}</a>
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
