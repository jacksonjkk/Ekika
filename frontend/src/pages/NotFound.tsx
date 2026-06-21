import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-4xl mx-auto text-center">
      <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-bold tracking-widest uppercase mb-6">
        Page Missing
      </span>
      <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface mb-6 md:mb-8">
        This trail does not exist yet.
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10">
        The page may have moved, or the link may still be waiting to be built.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold uppercase tracking-widest">
          Go Home
        </Link>
        <Link to="/experiences" className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-bold uppercase tracking-widest">
          View Experiences
        </Link>
      </div>
    </main>
  );
}
