import { Badge } from '@/components/ui/badge';

const STATUS_MAP: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'muted'> = {
  Active: 'success',
  active: 'success',
  Inactive: 'muted',
  inactive: 'muted',
  Present: 'success',
  Pass: 'success',
  Paid: 'success',
  Shipped: 'success',
  Completed: 'success',
  Approved: 'success',
  Confirmed: 'success',
  Normal: 'muted',
  Scheduled: 'default',
  'In Progress': 'default',
  'In Production': 'default',
  'In Transit': 'default',
  'Quality Check': 'warning',
  Pending: 'warning',
  Review: 'warning',
  Warning: 'warning',
  High: 'warning',
  Late: 'warning',
  Overdue: 'danger',
  Critical: 'danger',
  Rejected: 'danger',
  Open: 'danger',
  Quote: 'muted',
  Prospect: 'muted',
  Resolved: 'success',
  Preferred: 'success',
  Medium: 'warning',
  Low: 'muted',
};

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_MAP[status] ?? 'muted';
  return <Badge variant={variant}>{status}</Badge>;
}

export function statusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'muted' {
  return STATUS_MAP[status] ?? 'muted';
}
