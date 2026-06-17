'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TableRowActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TableRowActions({ onView, onEdit, onDelete }: TableRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-erp-muted hover:text-erp-accent"
        onClick={onView}
        title="View"
        aria-label="View record"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-erp-muted hover:text-erp-accent"
        onClick={onEdit}
        title="Edit"
        aria-label="Edit record"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-erp-muted hover:text-erp-danger"
        onClick={onDelete}
        title="Delete"
        aria-label="Delete record"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
