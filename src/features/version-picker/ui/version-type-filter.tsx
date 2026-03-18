'use client';

import type { VersionType } from '../model/use-vanilla-versions';

const VERSION_TYPE_OPTIONS: { value: VersionType; label: string }[] = [
  { value: 'release', label: 'Releases' },
  { value: 'snapshot', label: 'Snapshots' },
  { value: 'old_beta', label: 'Betas' },
  { value: 'old_alpha', label: 'Alphas' },
];

interface VersionTypeFilterProps {
  filters: Set<VersionType>;
  onChange: (filters: Set<VersionType>) => void;
}

export function VersionTypeFilter({
  filters,
  onChange,
}: VersionTypeFilterProps) {
  const toggle = (type: VersionType) => {
    const next = new Set(filters);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    onChange(next);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {VERSION_TYPE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
            filters.has(opt.value)
              ? 'border-primary bg-primary/15 text-primary'
              : 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
