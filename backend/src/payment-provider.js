import { randomUUID } from "node:crypto";

export function createPaymentSession({ provider, method, amountCents, currency, simulateResult }) {
  if (method === "bank") {
    return {
      provider: "manual-bank",
      providerReference: `bank-${randomUUID()}`,
      status: "pending",
      instructions: "The Ekika team will provide bank details and confirm the transfer manually.",
    };
  }

  if (provider !== "mock") {
    const error = new Error(`Payment provider '${provider}' has not been configured.`);
    error.statusCode = 503;
    throw error;
  }

  const allowed = new Set(["pending", "paid", "failed"]);
  return {
    provider: "mock",
    providerReference: `mock-${randomUUID()}`,
    status: allowed.has(simulateResult) ? simulateResult : "pending",
    amountCents,
    currency,
    checkoutUrl: null,
  };
}
