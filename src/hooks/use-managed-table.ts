'use client';

import { useCallback, useMemo, useState } from 'react';
import { recordToDetailFields, type DetailField } from '@/components/erp/modules/record-detail-panel';

export function useManagedTable<T extends Record<string, unknown>>(
  initialData: T[],
  getKey: (row: T) => string,
  fieldLabels: Record<string, string>,
  options?: { onEdit?: (row: T) => void },
) {
  const [records, setRecords] = useState<T[]>(initialData);
  const [viewRecord, setViewRecord] = useState<T | null>(null);
  const [editRecord, setEditRecord] = useState<T | null>(null);

  const deleteRow = useCallback(
    (row: T) => {
      const key = getKey(row);
      if (!window.confirm('Delete this record?')) return;
      setRecords((prev) => prev.filter((r) => getKey(r) !== key));
      setViewRecord((current) => (current && getKey(current) === key ? null : current));
      setEditRecord((current) => (current && getKey(current) === key ? null : current));
    },
    [getKey],
  );

  const saveEdit = useCallback(
    (updated: T) => {
      const key = getKey(updated);
      setRecords((prev) => prev.map((r) => (getKey(r) === key ? updated : r)));
      setEditRecord(null);
    },
    [getKey],
  );

  const rowActions = useMemo(
    () => ({
      onView: (row: T) => setViewRecord(row),
      onEdit: (row: T) => {
        if (options?.onEdit) options.onEdit(row);
        else setEditRecord(row);
      },
      onDelete: deleteRow,
    }),
    [deleteRow, options],
  );

  const detailFields: DetailField[] = useMemo(
    () => (viewRecord ? recordToDetailFields(viewRecord, fieldLabels) : []),
    [viewRecord, fieldLabels],
  );

  return {
    records,
    setRecords,
    viewRecord,
    setViewRecord,
    editRecord,
    setEditRecord,
    rowActions,
    saveEdit,
    detailFields,
  };
}
