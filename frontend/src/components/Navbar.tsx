import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { clearAdminToken, logoutCustomer, useAdminAuth, useCustomer } from "../data/api";
import "./Navbar.css";

export default function Navbar() {
  const customer = useCustomer();
  const isAdmin = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Experiences", path: "/experiences" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
        <div className="navbar-logo-container">
          <img 
            src={logo} 
            alt="Ekika Logo" 
          />
        </div>
        <div className="navbar-brand-text">
          <span className="navbar-brand-name">Ekika</span>
          <span className="navbar-brand-subtitle">Cultural Experience</span>
        </div>
      </Link>

      {/* Desktop Links */}
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`navbar-link ${location.pathname === link.path ? "active" : ""}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="navbar-actions">
        {isAdminPage ? (
          isAdmin ? (
            <>
              <span className="max-sm:hidden flex items-center gap-1 font-bold text-xs uppercase px-4 py-2 text-primary">
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                Admin Session
              </span>
              <button onClick={clearAdminToken} className="navbar-signout-btn font-bold text-xs uppercase px-4 py-2 bg-surface-container-high text-[#1f1b13] rounded-full hover:bg-surface-container-highest transition-colors max-sm:hidden">
                Sign Out
              </button>
            </>
          ) : null
        ) : customer ? (
          <>
            <Link to="/customer-portal" className="navbar-portal-btn flex items-center gap-1 font-bold text-xs uppercase px-4 py-2 border border-[#883600] rounded-full text-[#883600] hover:bg-surface-container-high transition-all max-sm:hidden">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Portal</span>
            </Link>
            <button onClick={logoutCustomer} className="navbar-signout-btn font-bold text-xs uppercase px-4 py-2 bg-surface-container-high text-[#1f1b13] rounded-full hover:bg-surface-container-highest transition-colors max-sm:hidden">
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/customer-access" className="navbar-signin-btn font-bold text-xs uppercase px-4 py-2 text-[#78706c] hover:text-[#1f1b13] transition-colors max-sm:hidden">
            Sign In
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="navbar-menu-toggle"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`mobile-menu-link ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
          {!isAdminPage && customer && (
            <Link
              to="/customer-portal"
              onClick={() => setIsOpen(false)}
              className={`mobile-menu-link ${location.pathname === "/customer-portal" ? "active" : ""}`}
            >
              My Dashboard
            </Link>
          )}
          <div className="mobile-menu-divider flex flex-col gap-2">
            {isAdminPage ? (
              isAdmin ? (
                <button onClick={() => { clearAdminToken(); setIsOpen(false); }} className="btn-book-experience bg-surface-container-highest text-[#1f1b13]">
                  Admin Sign Out
                </button>
              ) : null
            ) : customer ? (
              <button onClick={() => { logoutCustomer(); setIsOpen(false); }} className="btn-book-experience bg-surface-container-highest text-[#1f1b13]">
                Sign Out
              </button>
            ) : (
              <Link to="/customer-access" onClick={() => setIsOpen(false)}>
                <button className="btn-book-experience bg-surface-container-high text-[#1f1b13] border border-outline-variant/20 mb-1">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
