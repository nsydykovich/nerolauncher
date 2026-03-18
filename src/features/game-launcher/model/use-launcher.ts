'use client';

// Game launcher hook — implemented in Phase 5
// Stub for Phase 1 UI

export function useLauncher(instanceId: string) {
  const launch = async (_username: string) => {
    console.warn('launch_instance not yet implemented', instanceId);
  };

  const kill = async () => {
    console.warn('kill_instance not yet implemented', instanceId);
  };

  return { launch, kill, status: 'idle' as const };
}
