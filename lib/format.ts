// Turkish price formatting — dot as thousands separator, no decimals, "TL"
// suffix. Single shared helper, used everywhere a price is displayed.
export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString("tr-TR")} TL`;
}
