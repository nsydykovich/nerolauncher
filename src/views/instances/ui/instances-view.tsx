'use client';

import { useInstances } from '@/features/instance-manager';
import { InstanceGrid } from '@/widgets/instance-grid';

export function InstancesView() {
  const { instances, loading, error, remove } = useInstances();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading instances…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h1 className="text-foreground text-2xl font-bold">Instances</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {instances.length === 0
            ? 'No instances yet. Create one to get started.'
            : `${instances.length} instance${instances.length === 1 ? '' : 's'}`}
        </p>
      </div>
      <InstanceGrid instances={instances} onDelete={remove} />
    </div>
  );
}
