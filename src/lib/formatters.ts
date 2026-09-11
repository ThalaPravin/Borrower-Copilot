/**
 * Formats numbers into standard Indian Rupee notation (e.g. ₹1,10,000 or ₹8,00,000)
 */
export function formatINR(amount: number | null | undefined, options: { compact?: boolean } = {}): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Unknown";
  }

  // Handle rounding to nearest 1,000 for large numbers to avoid fake precision as required by prompt
  const rounded = Math.round(amount / 100) * 100;

  if (options.compact) {
    if (Math.abs(rounded) >= 10000000) {
      return `₹${(rounded / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(rounded) >= 100000) {
      return `₹${(rounded / 100000).toFixed(2)} Lakh`;
    }
    if (Math.abs(rounded) >= 1000) {
      return `₹${(rounded / 1000).toFixed(0)}k`;
    }
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  return formatter.format(rounded);
}

/**
 * Formats interest rate range (e.g. 11%–12.5%)
 */
export function formatRateRange(min: number | null, max: number | null): string {
  if (min === null || max === null) return "Rate unknown";
  if (min === max) return `${min.toFixed(1)}%`;
  return `${min.toFixed(1)}%–${max.toFixed(1)}%`;
}

/**
 * Formats loan amount range in Indian Rupee format
 */
export function formatINRRange(min: number | null, max: number | null): string {
  if (min === null || max === null) return "Amount unknown";
  if (min === max) return formatINR(min);
  return `${formatINR(min)} – ${formatINR(max)}`;
}
