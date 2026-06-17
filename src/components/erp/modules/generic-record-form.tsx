'use client';

import { useEffect, useState } from 'react';
import { FormInput, ModuleFormPanel } from '@/components/erp/modules/module-form-panel';
import { positiveNumber, required, validateFields } from '@/lib/form-validation';

type GenericRecordFormProps<T extends Record<string, unknown>> = {
  open: boolean;
  record: T | null;
  labels: Record<string, string>;
  onClose: () => void;
  onSave: (updated: T) => void;
  readOnlyKeys?: string[];
  requiredKeys?: string[];
  numericKeys?: string[];
  title?: string;
  subtitle?: string;
};

export function GenericRecordForm<T extends Record<string, unknown>>({
  open,
  record,
  labels,
  onClose,
  onSave,
  readOnlyKeys = ['id'],
  requiredKeys,
  numericKeys = [],
  title = 'Edit Record',
  subtitle = 'Update the selected record details',
}: GenericRecordFormProps<T>) {
  const [values, setValues] = useState<T | null>(record);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setValues(record);
    setFormError('');
  }, [record]);

  if (!open || !values) return null;

  const editableKeys = Object.keys(values).filter(
    (key) => !readOnlyKeys.includes(key) && (typeof values[key] === 'string' || typeof values[key] === 'number'),
  );

  const keysToRequire = requiredKeys ?? editableKeys;

  const handleSave = () => {
    if (!values) return;
    const error = validateFields([
      ...keysToRequire.map((key) => () => {
        const label = labels[key] ?? key;
        const value = values[key];
        if (typeof value === 'number' || numericKeys.includes(key)) {
          return positiveNumber(value as string | number, label);
        }
        return required(String(value ?? ''), label);
      }),
    ]);
    if (error) {
      setFormError(error);
      return;
    }
    onSave(values);
  };

  return (
    <ModuleFormPanel
      open={open}
      onClose={onClose}
      onSubmit={handleSave}
      title={title}
      subtitle={subtitle}
      submitLabel="Save Changes"
      error={formError}
    >
      {editableKeys.map((key) => (
        <FormInput
          key={key}
          label={labels[key] ?? key}
          value={String(values[key] ?? '')}
          onChange={(v) => {
            const original = values[key];
            const next = typeof original === 'number' ? (v === '' ? 0 : Number(v)) : v;
            setValues((prev) => (prev ? { ...prev, [key]: next } : prev));
            setFormError('');
          }}
          type={typeof values[key] === 'number' || numericKeys.includes(key) ? 'number' : 'text'}
          required={keysToRequire.includes(key)}
        />
      ))}
    </ModuleFormPanel>
  );
}
