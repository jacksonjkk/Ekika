import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
import { useSiteContent } from "../data/content";
import { useCustomer } from "../data/api";

export default function Footer() {
  const { site } = useSiteContent();
  const customer = useCustomer();
  return (
    <footer className="w-full bg-white dark:bg-[#1f1b13] border-t border-outline-variant/10 text-[#54433c] dark:text-[#eae1d3]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-9 sm:py-11 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_0.8fr_1fr] gap-x-8 gap-y-10 md:gap-12 items-start">
          <div className="space-y-4 text-center sm:col-span-2 sm:text-left md:col-span-1">
            <Link to="/" className="inline-block max-w-full" aria-label={`${site.name} home`}>
              <img
                src={logo}
                alt={site.name}
                className="block w-64 max-w-full h-auto mx-auto sm:mx-0 sm:w-72 md:w-80"
              />
            </Link>
            <p className="font-body text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
              Empowering communities, preserving heritage, and sharing the spirit of the Kigezi Highlands.
            </p>
            <p className="text-xs uppercase tracking-widest font-bold text-[#883600] dark:text-[#a94c16]">
              {site.locationLabel}
            </p>
          </div>

          <nav aria-label="Footer navigation" className="space-y-4 text-center sm:text-left">
            <h2 className="font-headline text-sm font-black uppercase tracking-widest text-[#1f1b13] dark:text-[#fff8f1]">
              Explore
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-x-5 gap-y-3 text-sm">
              <Link className="hover:text-[#a94c16] transition-colors" to="/experiences">Packages</Link>
              <Link className="hover:text-[#a94c16] transition-colors" to="/gallery">Gallery</Link>
              {customer ? (
                <Link className="hover:text-[#a94c16] transition-colors" to="/customer-portal">My Dashboard</Link>
              ) : (
                <Link className="hover:text-[#a94c16] transition-colors" to="/customer-access">Sign In</Link>
              )}
              <Link className="hover:text-[#a94c16] transition-colors" to="/contact">Contact</Link>
              <Link className="hover:text-[#a94c16] transition-colors" to="/privacy">Privacy</Link>
              <Link className="hover:text-[#a94c16] transition-colors" to="/admin">Admin</Link>
            </div>
          </nav>

          <div className="space-y-5 text-center sm:text-left">
            <h2 className="font-headline text-sm font-black uppercase tracking-widest text-[#1f1b13] dark:text-[#fff8f1]">
              Contact
            </h2>
            <div className="space-y-3 text-sm">
              <a className="flex items-center justify-center sm:justify-start gap-3 hover:text-[#a94c16] transition-colors" href={site.phoneHref}>
                <span aria-hidden="true" className="material-symbols-outlined text-[#883600] dark:text-[#a94c16] shrink-0">call</span>
                <span>{site.phoneDisplay}</span>
              </a>
              <a className="flex items-center justify-center sm:justify-start gap-3 hover:text-[#a94c16] transition-colors min-w-0" href={`mailto:${site.email}`}>
                <span aria-hidden="true" className="material-symbols-outlined text-[#883600] dark:text-[#a94c16] shrink-0">mail</span>
                <span className="break-all">{site.email}</span>
              </a>
              <a className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#883600] text-white px-5 py-3 rounded-lg font-bold hover:bg-[#a94c16] transition-colors" href={site.whatsappUrl}>
                <span aria-hidden="true" className="material-symbols-outlined">chat</span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-center md:text-left">
          <p className="leading-relaxed">© {new Date().getFullYear()} {site.name}. Crafted in the Kigezi Highlands.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2">
            <Link className="hover:text-[#a94c16] transition-colors" to="/terms">Terms</Link>
            <Link className="hover:text-[#a94c16] transition-colors" to="/safety">Traveler Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
