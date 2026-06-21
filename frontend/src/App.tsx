import { useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Experiences from "./pages/Experiences";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import PaymentMethod from "./pages/PaymentMethod";
import PaymentStatus from "./pages/PaymentStatus";
import BookingPortal from "./pages/BookingPortal";
import CustomerAccess from "./pages/CustomerAccess";
import CustomerPortal from "./pages/CustomerPortal";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import RequireCustomer from "./components/RequireCustomer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToRoute />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route element={<RequireCustomer />}>
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkout/:bookingId" element={<Checkout />} />
            <Route path="/payment-method/:bookingId" element={<PaymentMethod />} />
            <Route path="/payment/:status" element={<PaymentStatus />} />
            <Route path="/booking-portal/:token" element={<BookingPortal />} />
            <Route path="/manage-booking" element={<Navigate to="/customer-portal" replace />} />
            <Route path="/customer-portal" element={<CustomerPortal />} />
          </Route>
          <Route path="/customer-access" element={<CustomerAccess />} />
          <Route path="/login" element={<CustomerAccess />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/safety" element={<LegalPage type="safety" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function ScrollToRoute() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.key, location.hash]);

  return null;
}

export default App;
