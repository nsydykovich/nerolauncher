'use client';

import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { OfflineProfile } from '@/entities/profile';

export function useProfile() {
  const [profile, setProfile] = useState<OfflineProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const result = await invoke<OfflineProfile | null>('get_profile');
      setProfile(result);
    } catch {
      // no profile yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setUsername = useCallback(async (username: string) => {
    const result = await invoke<OfflineProfile>('set_profile', { username });
    setProfile(result);
    return result;
  }, []);

  return { profile, loading, setUsername, refresh };
}
