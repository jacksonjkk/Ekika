import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Experiences", path: "/experiences" },
    { name: "Gallery", path: "/gallery" },
    { name: "Booking", path: "/booking" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl rounded-full bg-white/95 backdrop-blur-md shadow-2xl shadow-stone-950/5 flex justify-between items-center pl-2 md:pl-4 pr-6 md:pr-10 h-20 z-50 transition-all duration-500 border border-stone-200/50">
      <Link to="/" className="flex items-center group relative h-full">
        <div className="relative h-full flex items-center w-32 md:w-40 shrink-0">
          <img 
            src={logo} 
            alt="Ekika Logo" 
            className="w-full h-40 md:h-54 object-contain transition-transform duration-500 group-hover:scale-105 origin-center pointer-events-none drop-shadow-2xl absolute left-0 top-1/2 -translate-y-[53%]" 
          />
        </div>
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-sm md:text-2xl font-black text-stone-950 font-headline tracking-tighter shrink-0">
            Ekika
          </span>
          <span className="text-[10px] md:text-sm font-bold text-stone-600 font-headline uppercase tracking-widest leading-none">
            Cultural Experience
          </span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`font-semibold transition-all duration-300 font-headline tracking-tight ${location.pathname === link.path
                ? "text-stone-950 border-b-2 border-primary"
                : "text-stone-600 hover:text-primary"
              } pb-1`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link to="/booking" className="hidden sm:block">
          <button className="bg-gradient-to-r from-primary to-primary-container text-white px-5 md:px-6 py-2.5 rounded-full font-label font-bold text-xs md:text-sm tracking-wider uppercase scale-95 active:scale-90 transition-transform">
            Book Now
          </button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-stone-950 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[115px] bg-white/98 backdrop-blur-3xl rounded-3xl shadow-2xl z-40 md:hidden p-5 flex flex-col gap-3 border border-stone-200/50 mx-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-xl font-headline font-bold py-1 ${location.pathname === link.path
                  ? "text-primary border-l-4 border-primary pl-4 -ml-5"
                  : "text-stone-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-2 pt-4 border-t border-stone-200/50">
            <Link to="/booking">
              <button className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Book Your Experience
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
