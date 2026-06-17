'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { PermissionModuleGroup } from '@/data/permission-modules';
import { cn } from '@/lib/utils';

interface PermissionGroupProps {
  module: PermissionModuleGroup;
  selected: string[];
  onChange: (keys: string[], checked: boolean) => void;
  readOnly?: boolean;
  defaultExpanded?: boolean;
}

export function PermissionGroup({
  module,
  selected,
  onChange,
  readOnly = false,
  defaultExpanded = false,
}: PermissionGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const moduleKeys = module.permissions.map((p) => p.key);
  const allSelected = moduleKeys.every((k) => selected.includes(k));
  const someSelected = moduleKeys.some((k) => selected.includes(k));

  const toggleModule = () => {
    if (readOnly) return;
    onChange(moduleKeys, !allSelected);
  };

  const togglePermission = (key: string) => {
    if (readOnly) return;
    onChange([key], !selected.includes(key));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-erp-border bg-erp-card/40">
      <div className="flex items-center gap-2 bg-erp-bg/40 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-erp-muted transition-colors hover:bg-erp-card hover:text-erp-text"
          aria-expanded={expanded}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <label className="flex flex-1 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected;
            }}
            onChange={toggleModule}
            disabled={readOnly}
            className="h-4 w-4 rounded border-erp-border accent-erp-accent disabled:opacity-50"
          />
          <span className="text-sm font-semibold text-erp-text">{module.label}</span>
        </label>
        <span className="text-[11px] font-medium text-erp-muted">
          {moduleKeys.filter((k) => selected.includes(k)).length}/{moduleKeys.length}
        </span>
      </div>

      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 border-t border-erp-border/40 px-4 py-3 pl-12">
            {module.permissions.map((perm) => (
              <label
                key={perm.key}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-erp-bg/50',
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(perm.key)}
                  onChange={() => togglePermission(perm.key)}
                  disabled={readOnly}
                  className="h-4 w-4 rounded border-erp-border accent-erp-accent disabled:opacity-50"
                />
                <span className="text-erp-muted">{perm.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
