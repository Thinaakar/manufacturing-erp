'use client';

import { PermissionGroup } from '@/components/user-management/permission-group';
import { PERMISSION_MODULES } from '@/data/permission-modules';

interface PermissionsMatrixProps {
  selected: string[];
  onChange: (permissions: string[]) => void;
  readOnly?: boolean;
}

export function PermissionsMatrix({ selected, onChange, readOnly = false }: PermissionsMatrixProps) {
  const handleGroupChange = (keys: string[], checked: boolean) => {
    if (readOnly) return;
    const next = new Set(selected);
    keys.forEach((k) => (checked ? next.add(k) : next.delete(k)));
    onChange(Array.from(next));
  };

  return (
    <div className="max-h-[min(420px,50vh)] space-y-3 overflow-y-auto pr-1">
      {PERMISSION_MODULES.map((module, i) => (
        <PermissionGroup
          key={module.key}
          module={module}
          selected={selected}
          onChange={handleGroupChange}
          readOnly={readOnly}
          defaultExpanded={i < 2}
        />
      ))}
    </div>
  );
}
