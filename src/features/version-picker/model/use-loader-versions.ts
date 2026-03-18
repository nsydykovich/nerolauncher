'use client';

import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { LoaderType } from '@/entities/instance';

export function useLoaderVersions(loaderType: LoaderType, mcVersion: string) {
  const [versions, setVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loaderType === 'vanilla' || !mcVersion) {
      setVersions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const commandMap: Record<string, string> = {
      fabric: 'fetch_fabric_versions',
      quilt: 'fetch_quilt_versions',
      forge: 'fetch_forge_versions',
      neoforge: 'fetch_neoforge_versions',
    };

    const command = commandMap[loaderType];
    if (!command) {
      setLoading(false);
      return;
    }

    invoke<string[]>(command, { mcVersion })
      .then((result) => {
        if (!cancelled) {
          setVersions(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err));
          setVersions([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loaderType, mcVersion]);

  return { versions, loading, error };
}
