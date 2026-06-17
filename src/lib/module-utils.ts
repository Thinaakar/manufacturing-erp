export function nextRecordId(prefix: string, existing: { id: string }[]): string {
  const nums = existing
    .map((r) => {
      const match = r.id.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !Number.isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `${prefix}-${String(next).padStart(4, '0')}`;
}

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  if (Number.isNaN(num)) return '$0';
  return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function stripCurrency(value: string): string {
  return value.replace(/[$,]/g, '');
}

export function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
