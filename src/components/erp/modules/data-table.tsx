'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableRowActions } from '@/components/erp/modules/table-row-actions';
import { cn } from '@/lib/utils';

export type DataColumn<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  mono?: boolean;
};

export type RowActions<T> = {
  onView: (row: T) => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
};

type DataTableProps<T> = {
  title?: string;
  subtitle?: string;
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  action?: React.ReactNode;
  rowActions?: RowActions<T>;
};

export function DataTable<T>({
  title,
  subtitle,
  columns,
  data,
  rowKey,
  action,
  rowActions,
}: DataTableProps<T>) {
  const allColumns = rowActions
    ? [
        ...columns.filter((col) => col.key !== 'actions' && col.key !== 'action'),
        {
          key: 'actions',
          header: '',
          className: 'w-[120px]',
          mono: false,
          render: (row: T) => (
            <TableRowActions
              onView={() => rowActions.onView(row)}
              onEdit={() => rowActions.onEdit(row)}
              onDelete={() => rowActions.onDelete(row)}
            />
          ),
        } satisfies DataColumn<T>,
      ]
    : columns;

  return (
    <Card className="erp-glass-hover overflow-hidden">
      {(title || action) && (
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <p className="text-sm text-erp-muted">{subtitle}</p>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !action && 'pt-6', 'overflow-x-auto p-0')}>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-erp-border bg-erp-bg/40">
              {allColumns.map((col) => (
                <th key={col.key} className="erp-table-head">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-erp-border/50 transition-colors hover:bg-erp-accent/5"
              >
                {allColumns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('erp-table-cell', col.mono && 'font-mono text-xs', col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
