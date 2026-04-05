import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            alt="Scenic highland landscape"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4CTXUHSJZR_5__C71jt18vCqz2yHvcNEXHjT0msxfXiObCQNHWz8-fx9TgfgrUHGAUEUNdq5lG3o47kNAtwggd3MD3jw-yZHugi_ESS4tBE285_hAR50M2db-U0CXgKZpxZJkSTnkFIW7FsZIZsu-_6-XDiopPc7mcT1HmumEq-V2UqdTkwPsYPceTV5nb8tVDN_SRqsR5VQfCWl3xd9VjBj0ZVz5YMJpuLmPbg0oe87vcsEa5Fp_vI3JX8MJHzfucLaazQlw2Ag"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-on-background/20 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full mt-36 md:mt-64">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-4 bg-tertiary/10 text-tertiary rounded-full text-xs font-bold uppercase tracking-widest mb-6">Traditional Wisdom & Cultural Roots</span>
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-headline font-extrabold text-on-surface leading-[1.1] mb-8 tracking-tighter">
              Experience the <span className="text-primary italic">Authentic</span> Kiga Culture
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-body mb-10 leading-relaxed max-w-2xl">
              Journey into the heart of the Kigezi Highlands. Discover the rhythm of the hills through ancient songs, traditional craft, and the enduring spirit of the people of the mountains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/experiences">
                <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-5 rounded-xl font-label font-bold text-base tracking-wider uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  Explore Experiences
                </button>
              </Link>
              <button className="flex items-center justify-center gap-3 bg-surface-container-low/50 backdrop-blur-md text-primary px-10 py-5 rounded-xl font-label font-bold text-base tracking-wider uppercase hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">play_circle</span>
                Watch Our Story
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Our Story Section */}
      <section className="py-16 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-24 h-24 kiga-pattern rounded-full"></div>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  alt="Cultural experience activity"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOUZwosavXYGjHhxvE1jmJsrBIXXuahLFdG9e46ceuRdiqd9ukecElSX4iplW9gkzq7Ag7FplTZp-ZY7-2nOPdDSA3OF7-4kV0EPJPkgUafkWOA55h5CjMm4iXBNoNinrXdLsKJMAkfvEYo1VkXH0Ntey9WbdzrJl_FRTjKna8YfDT08moQI6Nv3bumK0vARiGt0ojuuRBIAdjMH1lpzACuq9BvZPPstd6NsDf0UH5CyTPz_aXTy2VmAYC-BDs5MlMEfT5Twncshs"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-1/2 aspect-square rounded-[2rem] border-8 border-surface overflow-hidden shadow-xl hidden lg:block">
                <img
                  alt="Basket weaving detail"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2cKZ6juzAoAY2CyJb-Hv9VmxIPC0wFf0j5KdU9JLK7o8gSUfGbXbvcJOTXV2QMHtdxvtlMgi_IsRynX0hnAsjXmPhA-ly5LzwcNAs_MazCwQAjxwESY2zTjZZwkKKg5lgsM9dUMo8weA-ItjjlMsAY-0K4wbU8hYsbkc3GjeK1TqHUNjkpsQ_-gFNSHrahUNlms5PLE0_Gm78Dc2Qh8gB9epx0-KgkEJ7SQNqfdHI5lsBx8PGsI8HQh8Hc-kpajRPRlNp8YknjJc"
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface">Our Story</h2>
                <div className="h-1.5 w-20 bg-primary-container rounded-full"></div>
              </div>
              <div className="space-y-6 text-on-surface-variant font-body text-lg leading-relaxed">
                <p>
                  Nestled in the mist-covered "Switzerland of Africa," the Bakiga people have cultivated a heritage as resilient as the terraced hills they inhabit. For centuries, our culture has been shared through the oral traditions of the Griots—the keepers of history.
                </p>
                <p>
                  The <span className="font-bold underline decoration-primary">Ekika Cultural Experience</span> was born from a desire to preserve this vibrant heritage while empowering the local communities of Kabale. We don't just show you our world; we invite you to live within it—weaving baskets, brewing traditional honey wine, and dancing the energetic <span className="italic font-bold text-primary">Ekizino</span> dance.
                </p>
                <p>
                  Every visit supports sustainable community development, ensuring that the legacy of the highlands continues to flourish for generations to come.
                </p>
              </div>
              <div className="pt-6">
                <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold font-label tracking-tight group">
                  Learn more about our heritage
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-32 bg-surface-container-low rounded-t-[40px] md:rounded-t-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface mb-6">Echoes from the Hills</h2>
            <p className="text-on-surface-variant text-lg">Travelers from across the globe have found home in our highlands. Here are some of their stories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
              <div className="flex gap-1 text-primary-container mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <blockquote className="text-on-surface-variant font-body text-lg leading-relaxed mb-8 flex-grow">
                "The dance ceremony was like nothing I've ever seen. The energy, the drums, the warmth of the village—it truly felt like a transformation rather than just a tour."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high">
                  <img
                    alt="User portrait"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-o54n0qT_eGcn6WAZZUT6kid4_hqixsVsCnwILW7uVkBoeW-HSDYSePfun781BWxJmFiWRff7uXyM2q9us0nlXTVUfzKAj769WZeEXDDhBPDAS6oa5tuzDRl6crVx6bFlNKrWcn408jj9BaLAuk5MzVCGheVML_3Z6H06aI35tZB5p0JoROfDVd04ba4x8NOLCaNrjHeUDt0JugsmadKZWVkxKGxFJnd9Lewtq4HPhW-dQHJir8mmDyN8jvHLkLRdBAI3va14gUg"
                  />
                </div>
                <div>
                  <p className="font-headline font-bold text-on-surface">Sarah Mitchell</p>
                  <p className="text-sm text-on-surface-variant/70 uppercase tracking-widest font-label">London, UK</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-primary text-on-primary p-8 rounded-3xl shadow-xl shadow-primary/20 flex flex-col h-full md:-translate-y-8">
              <div className="flex gap-1 text-primary-fixed mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <blockquote className="font-body text-lg leading-relaxed mb-8 flex-grow">
                "Beyond the beautiful landscapes, it's the people that make this place special. We spent a day learning traditional farming and it was the highlight of our Uganda trip."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20">
                  <img
                    alt="User portrait"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDADczsgIavf_eTu17Kug62piQ2INIn8XxViepin2Yr9ZezJ496ILeenlqSXL5E-3rC0JzuX-H6MGMzqyco-sEhw3SOe5Z729wPrCWtJrbl2oiB7o33jEkE2JFdrEVrY2ZmWKRXhBmZd_vDNUi-5Ch-ZmJDGsUk6ZhyJCIKfAlRdprlPbfpuQ5il6Vra_OAYP6lRbJJFODdwUUoqnFCEiICY6B7A3H7AZFz0MgeVUGXSbn2l9-miaS0ZRB_LLlsBnPJE-Wf3V7I9lI"
                  />
                </div>
                <div>
                  <p className="font-headline font-bold">David Chen</p>
                  <p className="text-sm text-on-primary/70 uppercase tracking-widest font-label">Toronto, CA</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
              <div className="flex gap-1 text-primary-container mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <blockquote className="text-on-surface-variant font-body text-lg leading-relaxed mb-8 flex-grow">
                "As a solo traveler, I felt completely safe and welcomed. The guides are incredibly knowledgeable about their history and very passionate."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high">
                  <img
                    alt="User portrait"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhE9CEdTV-dh1rAekKvpu86WgbS8J-_gchD3RRdOhqfwrOOljzMRrcYWEx1VTgdddOYh4UUZ4fvF6cjKi7qwxiZLmBx8hwzuknAWTAe_mSSRkx40pw9EOzjanth-dtM1XnXk2wqdRjIkQk1e_cz3Q0IHpkr5gsD4IrjSlx9R314CiexqT-84idB0NZ9pmYBfIz1UQZwjb4PQBJ0IQhXnYpfIlU767D7cFz2D1iizHMnMXcxZPC-CGe1sk_KRNOfqdz56qNuSzMRME"
                  />
                </div>
                <div>
                  <p className="font-headline font-bold text-on-surface">Elena Rodriguez</p>
                  <p className="text-sm text-on-surface-variant/70 uppercase tracking-widest font-label">Madrid, ES</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
