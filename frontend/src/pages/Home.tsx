import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicReviews } from "../data/api";
import type { Review } from "../data/api";
import Image from "../assets/buny.png";

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [hasReviewsLoadError, setHasReviewsLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;


    getPublicReviews()
      .then((result) => {
        if (!mounted) return;
        setReviews(result.reviews);
      })
      .catch((error) => {
        if (!mounted) return;
        setHasReviewsLoadError(true);
        console.error("Failed to load reviews:", error);
        setReviews([]);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoadingReviews(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="p-8 rounded-3xl flex flex-col h-full transition-all duration-300 bg-surface-container-lowest shadow-sm"
        >
          <div className="flex gap-1 mb-6 text-[#eab308]">
            {Array.from({ length: 5 }).map((_, j) => (
              <span
                key={j}
                className="material-symbols-outlined animate-pulse opacity-60"
                style={{ fontVariationSettings: `'FILL' 0` }}
              >
                star
              </span>
            ))}
          </div>

          <div className="animate-pulse">
            <div className="h-6 bg-on-surface/10 rounded w-11/12 mb-4" />
            <div className="h-6 bg-on-surface/10 rounded w-10/12 mb-4" />
            <div className="h-6 bg-on-surface/10 rounded w-9/12" />
          </div>

          <div className="mt-auto flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-on-surface/10 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-on-surface/10 rounded w-2/3 mb-3 animate-pulse" />
              <div className="h-3 bg-on-surface/10 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <header className="relative min-h-[680px] h-[100svh] w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            alt="Traditional dance performance"
            className="w-full h-full object-cover"
            src={Image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-background/20 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 w-full pt-20 sm:pt-28">
          <div className="max-w-3xl rounded-[2rem] bg-background/5 backdrop-blur-[2px] p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/10">
            <span className="inline-block py-1 px-4 bg-white/15 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Traditional Wisdom & Cultural Roots
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-headline font-extrabold text-white leading-[1.08] mb-6 sm:mb-8">
              Experience the <span className="text-primary/90 italic">Authentic</span> Kiga Culture
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 font-body mb-8 sm:mb-10 leading-relaxed max-w-2xl">
              Journey into the heart of the Kigezi Highlands. Discover the rhythm of the hills through ancient songs,
              traditional craft, and the enduring spirit of the people of the mountains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/experiences"
                className="flex min-h-14 w-full sm:w-auto items-center justify-center bg-gradient-to-r from-primary to-primary-container text-white px-6 sm:px-8 py-4 rounded-lg font-label font-bold text-sm uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-transform text-center"
              >
                Explore Packages
              </Link>
              <Link
                to="/about"
                className="flex min-h-14 w-full sm:w-auto items-center justify-center gap-3 bg-surface-container-low/80 backdrop-blur-md text-primary px-6 sm:px-8 py-4 rounded-lg font-label font-bold text-sm uppercase hover:bg-surface-container-high transition-colors text-center"
              >
                <span className="material-symbols-outlined">play_circle</span>
                Watch Our Story
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Our Story Section */}
      <section className="py-16 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative group">
              <div className="absolute -top-4 -left-4 w-24 h-24 kiga-pattern rounded-full"></div>
              <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
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
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-on-surface">Our Story</h2>
                <div className="h-1.5 w-20 bg-primary-container rounded-full"></div>
              </div>
              <div className="space-y-5 text-on-surface-variant font-body text-base sm:text-lg leading-relaxed">
                <p>
                  Nestled in the mist-covered "Switzerland of Africa," the Bakiga people have cultivated a heritage as
                  resilient as the terraced hills they inhabit. For centuries, our culture has been shared through the
                  oral traditions of the Griots—the keepers of history.
                </p>
                <p>
                  The <span className="font-bold underline decoration-primary">Ekika Cultural Experience</span> was born
                  from a desire to preserve this vibrant heritage while empowering the local communities of Kabale. We
                  don't just show you our world; we invite you to live within it—weaving baskets, brewing traditional
                  honey wine, and dancing the energetic <span className="italic font-bold text-primary">Ekizino</span>
                  dance.
                </p>
                <p>
                  Every visit supports sustainable community development, ensuring that the legacy of the highlands
                  continues to flourish for generations to come.
                </p>
              </div>
              <div className="pt-6">
                <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold font-label group">
                  Learn more about our heritage
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-32 bg-surface-container-low rounded-t-[40px] md:rounded-t-[4rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-on-surface mb-6">Echoes from the Hills</h2>
            <p className="text-on-surface-variant text-lg">Travelers from across the globe have found home in our highlands. Here are some of their stories.</p>
          </div>

          {isLoadingReviews ? (
            renderSkeleton()
          ) : hasReviewsLoadError ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant font-body">Unable to load reviews right now.</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant font-body">No reviews yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((review, index) => {
                const isHighlighted = index === 1;

                return (
                  <div
                    key={review.id}
                    className={`p-8 rounded-3xl flex flex-col h-full transition-all duration-300 ${
                      isHighlighted
                        ? "bg-primary text-on-primary shadow-xl shadow-primary/20 md:-translate-y-8 hover:shadow-2xl hover:shadow-primary/30"
                        : "bg-surface-container-lowest shadow-sm hover:shadow-xl hover:shadow-primary/5 text-on-surface"
                    }`}
                  >
                    <div className={`flex gap-1 mb-6 ${isHighlighted ? "text-[#fde047]" : "text-[#eab308]"}`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined"
                          style={{ fontVariationSettings: `'FILL' ${i < review.rating ? 1 : 0}` }}
                        >
                          star
                        </span>
                      ))}
                    </div>

                    <blockquote className="font-body text-lg leading-relaxed mb-8 flex-grow">"{review.comment}"</blockquote>

                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-full overflow-hidden shrink-0 ${
                          isHighlighted ? "bg-white/20" : "bg-surface-container-high"
                        }`}
                      >
                        {review.reviewerPhoto ? (
                          <img alt={review.reviewerName} className="w-full h-full object-cover" src={review.reviewerPhoto} />
                        ) : (
                          <span
                            className={`material-symbols-outlined text-3xl flex items-center justify-center h-full w-full ${
                              isHighlighted ? "text-on-primary/70" : "text-on-surface-variant/70"
                            }`}
                          >
                            person
                          </span>
                        )}
                      </div>

                      <div>
                        <p className={`font-headline font-bold ${isHighlighted ? "text-on-primary" : "text-on-surface"}`}>{review.reviewerName}</p>
                        <p className={`text-xs uppercase tracking-widest font-label font-bold ${isHighlighted ? "text-on-primary/70" : "text-on-surface-variant/70"}`}> 
                          {review.experienceTitle || "Kiga Experience"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
 