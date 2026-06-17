type FieldCheck = () => string | null;

export function required(value: string | undefined | null, label: string): string | null {
  if (!value?.trim()) return `${label} is required.`;
  return null;
}

export function positiveNumber(value: string | number | undefined | null, label: string): string | null {
  const num = typeof value === 'number' ? value : parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  if (Number.isNaN(num) || num <= 0) return `${label} must be a number greater than 0.`;
  return null;
}

export function scorePercent(value: string | number | undefined | null, label: string): string | null {
  const num = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  if (Number.isNaN(num) || num < 1 || num > 100) return `${label} must be between 1 and 100.`;
  return null;
}

export function validateFields(checks: FieldCheck[]): string | null {
  for (const check of checks) {
    const error = check();
    if (error) return error;
  }
  return null;
}
