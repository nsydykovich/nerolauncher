'use client';

import { useState } from 'react';
import {
  useVanillaVersions,
  type VersionType,
} from '../model/use-vanilla-versions';
import { VersionTypeFilter } from './version-type-filter';

interface MinecraftVersionSelectProps {
  value: string;
  onChange: (version: string) => void;
}

export function MinecraftVersionSelect({
  value,
  onChange,
}: MinecraftVersionSelectProps) {
  const [filters, setFilters] = useState<Set<VersionType>>(
    () => new Set(['release'])
  );
  const { versions, loading } = useVanillaVersions(filters);

  return (
    <div className="space-y-1.5">
      <label className="text-foreground text-sm font-medium">
        Minecraft Version
      </label>
      <VersionTypeFilter filters={filters} onChange={setFilters} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="border-border bg-background/50 text-foreground focus:border-primary focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm backdrop-blur-sm transition-colors focus:ring-1 focus:outline-none disabled:opacity-50"
      >
        <option value="" disabled>
          {loading ? 'Loading versions…' : 'Select version…'}
        </option>
        {versions.map((v) => (
          <option key={v.id} value={v.id}>
            {v.id}
          </option>
        ))}
      </select>
    </div>
  );
}
