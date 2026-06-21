import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../data/api";

type GalleryImage = {
  id: string;
  title: string;
  tag: string | null;
  imageUrl: string;
  altText: string;
};

const spans = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest<{ gallery: GalleryImage[] }>("/api/gallery")
      .then((result) => {
        if (active) setImages(result.gallery);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto">
      <header className="mb-12 md:mb-20 text-center md:text-left">
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-background mb-6">
          Captured Moments <br className="hidden md:block" /> of the Highlands.
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed">
          Journey through the lens into the heart of Kigezi. From the warmth of our hearths to the rhythm of our dances, explore the vibrant soul of Bakiga culture.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-[260px] md:auto-rows-[300px]" aria-label="Loading gallery">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div className="animate-pulse rounded-xl bg-surface-container-high" key={item} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-surface-container-low p-10 text-center text-on-surface-variant">
          The gallery could not be loaded. Please try again shortly.
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-low p-10 text-center">
          <span className="material-symbols-outlined text-primary text-5xl mb-4">photo_library</span>
          <h2 className="font-headline text-2xl font-black text-on-surface mb-2">New moments are coming soon.</h2>
          <p className="text-on-surface-variant">Our team is preparing the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-4 sm:gap-6 auto-rows-[260px] md:auto-rows-[300px]">
          {images.map((image, index) => (
            <div key={image.id} className={`${spans[index % spans.length]} relative group overflow-hidden rounded-xl bg-surface-container`}>
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={image.imageUrl} alt={image.altText} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b13]/90 via-transparent to-transparent flex flex-col justify-end p-5 sm:p-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                {image.tag && <span className="text-primary-container font-bold text-sm tracking-widest uppercase mb-2">{image.tag}</span>}
                <h3 className="text-on-primary-container text-2xl font-headline font-bold">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="mt-16 md:mt-32 rounded-2xl bg-surface-container-high p-6 sm:p-10 md:p-20 flex flex-col items-center text-center">
        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6">Join the Story</span>
        <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl font-black text-on-surface mb-8 leading-tight">
          Beyond the Frame, <br /> Experience the Soul.
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Link to="/experiences" className="bg-primary hover:bg-primary-container text-on-primary px-6 sm:px-10 py-4 sm:py-5 rounded-lg font-headline font-bold text-base sm:text-lg transition-all shadow-lg shadow-primary/20">
            Book Your Experience
          </Link>
          <Link to="/experiences" className="bg-transparent hover:bg-surface-variant text-primary px-6 sm:px-10 py-4 sm:py-5 rounded-lg font-headline font-bold text-base sm:text-lg transition-all border-2 border-primary">
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
