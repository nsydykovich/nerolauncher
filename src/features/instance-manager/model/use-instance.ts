'use client';

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Instance } from '@/entities/instance';

export function useInstance(instanceId: string) {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await invoke<Instance>('get_instance', { instanceId });
      setInstance(result);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [instanceId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { instance, loading, error, refresh };
}
