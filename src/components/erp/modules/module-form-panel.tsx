'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModalPortal } from '@/components/ui/modal-portal';

export function FormError({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-erp-danger/30 bg-erp-danger/5 px-3 py-2 text-sm text-erp-danger">
      {message}
    </p>
  );
}

type ModuleFormPanelProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  title?: string;
  subtitle?: string;
  error?: string;
  children: React.ReactNode;
};

export function ModuleFormPanel({
  open,
  onClose,
  onSubmit,
  submitLabel = 'Save',
  title,
  subtitle,
  error,
  children,
}: ModuleFormPanelProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:p-6">
        <div className="flex min-h-full items-end justify-center sm:items-center">
          <div
            className="erp-glass flex w-full max-w-2xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden sm:max-h-[min(92vh,calc(100vh-3rem))]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'module-form-title' : undefined}
          >
            <div className="flex items-start justify-between gap-4 border-b border-erp-border px-6 py-4">
              <div>
                {title && (
                  <h3 id="module-form-title" className="font-display text-lg font-semibold text-erp-text">
                    {title}
                  </h3>
                )}
                {subtitle && <p className="mt-0.5 text-sm text-erp-muted">{subtitle}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {error && <FormError message={error} />}
                <div className="grid gap-4 sm:grid-cols-2">{children}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-erp-border px-6 py-4">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onSubmit}>{submitLabel}</Button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
};

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  required = false,
}: FormInputProps) {
  return (
    <div className={className}>
      <label className="erp-label mb-2 block">
        {label}
        {required && <span className="text-erp-danger"> *</span>}
      </label>
      <input
        type={type}
        className="erp-input w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

type FormSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
};

export function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  className,
}: FormSelectProps) {
  return (
    <div className={className}>
      <label className="erp-label mb-2 block">
        {label}
        {required && <span className="text-erp-danger"> *</span>}
      </label>
      <select
        className="erp-input w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
