'use client';

import { useState, useEffect, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';

export type VersionType = 'release' | 'snapshot' | 'old_beta' | 'old_alpha';

export interface VanillaVersion {
  id: string;
  type: VersionType;
  url: string;
  releaseTime: string;
}

interface VanillaManifest {
  latest: { release: string; snapshot: string };
  versions: VanillaVersion[];
}

export function useVanillaVersions(filters: Set<VersionType>) {
  const [allVersions, setAllVersions] = useState<VanillaVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    invoke<VanillaManifest>('fetch_vanilla_versions')
      .then((manifest) => {
        if (!cancelled) {
          setAllVersions(
            manifest.versions.map((v) => ({
              id: v.id,
              type: v.type,
              url: v.url,
              releaseTime: v.releaseTime,
            }))
          );
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const versions = useMemo(
    () => allVersions.filter((v) => filters.has(v.type)),
    [allVersions, filters]
  );

  return { versions, loading, error };
}
