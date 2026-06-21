import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchCustomerProfile, getCachedCustomer, useCustomer } from "../data/api";

export default function RequireCustomer() {
  const customer = useCustomer();
  const location = useLocation();
  const [sessionChecked, setSessionChecked] = useState(() => Boolean(getCachedCustomer()));

  useEffect(() => {
    if (customer || sessionChecked) return;

    let active = true;
    fetchCustomerProfile()
      .catch(() => undefined)
      .finally(() => {
        if (active) setSessionChecked(true);
      });

    return () => {
      active = false;
    };
  }, [customer, sessionChecked]);

  if (customer) return <Outlet />;

  if (!sessionChecked) {
    return (
      <main className="pt-36 pb-20 text-center text-on-surface-variant">
        Checking your session...
      </main>
    );
  }

  const returnPath = `${location.pathname}${location.search}${location.hash}`;
  return <Navigate to={`/customer-access?redirect=${encodeURIComponent(returnPath)}`} replace />;
}

