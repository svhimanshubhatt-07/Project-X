export function formatNumber(num?: number): string {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatCompactNumber(num?: number): string {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(num);
}
