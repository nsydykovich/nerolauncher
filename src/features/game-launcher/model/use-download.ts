'use client';

// Download orchestrator hook — implemented in Phase 4
// Stub for Phase 1 UI

export function useDownload(instanceId: string) {
  return {
    phase: null as string | null,
    current: 0,
    total: 0,
    isComplete: false,
    startDownload: async () => {
      console.warn('download not yet implemented', instanceId);
    },
  };
}
