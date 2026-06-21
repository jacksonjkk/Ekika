export const bookingSteps = ["Details", "Review", "Payment", "Confirmation"];

export function parsePrice(price: string) {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

export function formatUsd(amount: number) {
  return `$${amount.toFixed(2).replace(/\.00$/, "")}`;
}

export function getDepositAmount(total: number) {
  return Math.max(0, Math.ceil(total * 0.3));
}

export function todayString() {
  return new Date().toISOString().split("T")[0];
}
