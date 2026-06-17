'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type DetailField = {
  label: string;
  value: React.ReactNode;
};

type RecordDetailPanelProps = {
  open: boolean;
  title: string;
  fields: DetailField[];
  onClose: () => void;
};

export function RecordDetailPanel({ open, title, fields, onClose }: RecordDetailPanelProps) {
  if (!open) return null;

  return (
    <div className="erp-glass rounded-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-erp-text">{title}</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="rounded-lg border border-erp-border bg-erp-bg/40 px-4 py-3">
            <dt className="erp-label mb-1">{field.label}</dt>
            <dd className="text-sm font-medium text-erp-text">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function recordToDetailFields(
  record: Record<string, unknown>,
  labels: Record<string, string>,
  skipKeys: string[] = [],
): DetailField[] {
  return Object.entries(record)
    .filter(([key]) => !skipKeys.includes(key))
    .map(([key, value]) => ({
      label: labels[key] ?? key,
      value: value === null || value === undefined ? '—' : String(value),
    }));
}
