export function parseToFloat(v: any): number {
  if (!v) return 0;
  let s = String(v).trim();
  if (s.includes(',') && s.includes('.')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  }
  s = s.replace(/[^0-9.-]/g, '');
  return parseFloat(s) || 0;
}

export function formatCurrency(v: any, isUsd: boolean = false, usdRate: number = 1): string {
  const num = parseToFloat(v);
  if (isUsd && usdRate > 0) {
    const usdValue = num / usdRate;
    const formatted = new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(usdValue);
    return `$ ${formatted}`;
  }
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(num);
}