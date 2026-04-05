import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[32px] bg-white dark:bg-[#1f1b13] flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 text-primary shadow-2xl border-t border-outline-variant/10">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <Link to="/" className="flex items-center gap-6">
          <img src={logo} alt="Ekika Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
          <span className="text-2xl md:text-3xl font-black text-[#1f1b13] dark:text-[#fff8f1] font-headline">
            Ekika Cultural Experience
          </span>
        </Link>
        <p className="font-body text-sm text-[#54433c] dark:text-[#eae1d3] max-w-xs text-center md:text-left">
          Empowering communities, preserving heritage, and sharing the spirit of the hills.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 font-body text-sm">
        <Link className="text-[#54433c] dark:text-[#eae1d3] hover:text-[#a94c16] transition-all opacity-80 hover:opacity-100" to="/privacy">Privacy Policy</Link>
        <Link className="text-[#54433c] dark:text-[#eae1d3] hover:text-[#a94c16] transition-all opacity-80 hover:opacity-100" to="/terms">Terms of Service</Link>
        <Link className="text-[#54433c] dark:text-[#eae1d3] hover:text-[#a94c16] transition-all opacity-80 hover:opacity-100" to="/safety">Traveler Safety</Link>
      </div>
      <div className="flex flex-col items-center md:items-end gap-4">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-[#883600] dark:text-[#a94c16] opacity-80 hover:opacity-100 cursor-pointer transition-all" title="Facebook">social_leaderboard</span>
          <span className="material-symbols-outlined text-[#883600] dark:text-[#a94c16] opacity-80 hover:opacity-100 cursor-pointer transition-all" title="Instagram">retweet</span>
          <span className="material-symbols-outlined text-[#883600] dark:text-[#a94c16] opacity-80 hover:opacity-100 cursor-pointer transition-all" title="YouTube">youtube_activity</span>
        </div>
        <p className="text-[#54433c] dark:text-[#eae1d3] font-body text-sm opacity-80">
          © 2024 Ekika Cultural Experience. Crafted in the Kigezi Highlands.
        </p>
      </div>
    </footer>
  );
}
