'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormInput, FormSelect } from '@/components/erp/modules/module-form-panel';
import { required, validateFields } from '@/lib/form-validation';
import { useMasterDataStore } from '@/providers/master-data-store';

const FIELDS = [
  { key: 'companyName', label: 'Company Name' },
  { key: 'fiscalYearStart', label: 'Fiscal Year Start' },
  { key: 'currency', label: 'Default Currency' },
  { key: 'timeZone', label: 'Time Zone' },
  { key: 'shiftModel', label: 'Shift Model' },
] as const;

export function CompanySettingsSection() {
  const { companySettings, plants, loading, updateCompanySettings } = useMasterDataStore();
  const [form, setForm] = useState(companySettings);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(companySettings);
  }, [companySettings]);

  const plantOptions = plants
    .filter((p) => p.status === 'active')
    .map((p) => ({ value: p.id, label: p.name }));

  const handleSave = async () => {
    const err = validateFields([() => required(form.companyName, 'Company name')]);
    if (err) {
      setError(err);
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateCompanySettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save company settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="erp-glass-hover max-w-2xl">
      <CardHeader>
        <CardTitle>Company Configuration</CardTitle>
        <p className="text-sm text-erp-muted">
          Organization-wide settings synced to Firebase.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="rounded-lg border border-erp-danger/30 bg-erp-danger/5 px-3 py-2 text-sm text-erp-danger">
            {error}
          </p>
        )}
        {saved && (
          <p className="rounded-lg border border-erp-success/30 bg-erp-success/5 px-3 py-2 text-sm text-erp-success">
            Company settings saved to Firebase.
          </p>
        )}

        <FormInput
          label="Company Name"
          value={form.companyName}
          onChange={(v) => setForm((f) => ({ ...f, companyName: v }))}
          required
        />

        <FormSelect
          label="Primary Plant"
          value={form.primaryPlantId}
          onChange={(v) => setForm((f) => ({ ...f, primaryPlantId: v }))}
          options={
            plantOptions.length
              ? plantOptions
              : [{ value: form.primaryPlantId, label: loading ? 'Loading...' : 'No plants configured' }]
          }
        />

        {FIELDS.slice(1).map(({ key, label }) => (
          <FormInput
            key={key}
            label={label}
            value={form[key]}
            onChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
          />
        ))}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button className="gap-2" onClick={handleSave} disabled={saving || loading}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
