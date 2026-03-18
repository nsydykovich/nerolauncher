'use client';

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Instance, CreateInstanceInput } from '@/entities/instance';

export function useInstances() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await invoke<Instance[]>('list_instances');
      setInstances(result);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateInstanceInput): Promise<Instance> => {
      const instance = await invoke<Instance>('create_instance', { input });
      await refresh();
      return instance;
    },
    [refresh]
  );

  const remove = useCallback(
    async (instanceId: string): Promise<void> => {
      await invoke('delete_instance', { instanceId });
      await refresh();
    },
    [refresh]
  );

  return { instances, loading, error, refresh, create, remove };
}
