'use client';

import type { LoaderType } from '@/entities/instance';
import { useLoaderVersions } from '../model/use-loader-versions';

interface LoaderVersionSelectProps {
  loaderType: LoaderType;
  mcVersion: string;
  value: string;
  onChange: (version: string) => void;
}

export function LoaderVersionSelect({
  loaderType,
  mcVersion,
  value,
  onChange,
}: LoaderVersionSelectProps) {
  const { versions, loading } = useLoaderVersions(loaderType, mcVersion);

  if (loaderType === 'vanilla') return null;

  return (
    <div className="space-y-1.5">
      <label className="text-foreground text-sm font-medium">
        Loader Version
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || versions.length === 0}
        className="border-border bg-background/50 text-foreground focus:border-primary focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm backdrop-blur-sm transition-colors focus:ring-1 focus:outline-none disabled:opacity-50"
      >
        <option value="" disabled>
          {loading
            ? 'Loading…'
            : versions.length === 0
              ? 'Select MC version first'
              : 'Select loader version…'}
        </option>
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
