export const products = {
  combinationPliers: 'Combination Pliers',
  pliers: 'Pliers',
} as const;

export function moneyInCents(text: string): number {
  const normalized = text.replace(/[$,\s]/g, '');
  if (!/^\d+\.\d{2}$/.test(normalized)) {
    throw new Error(`Unexpected USD price: ${JSON.stringify(text)}`);
  }
  return Math.round(Number(normalized) * 100);
}

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
