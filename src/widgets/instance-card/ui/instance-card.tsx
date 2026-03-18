'use client';

import { useState } from 'react';
import { Play, Trash2, Box } from 'lucide-react';
import type { Instance } from '@/entities/instance';
import { getLoaderLabel, formatPlaytime } from '@/entities/instance';
import { DeleteConfirm } from '@/features/instance-manager';
import { Button } from '@/shared/ui';

interface InstanceCardProps {
  instance: Instance;
  onDelete: (id: string) => void;
}

export function InstanceCard({ instance, onDelete }: InstanceCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loaderLabel = getLoaderLabel(instance.loader.type);
  const playtime = formatPlaytime(instance.total_playtime_seconds);

  return (
    <>
      <div className="group border-border bg-card/50 hover:border-primary/50 hover:shadow-primary/5 relative flex flex-col rounded-xl border p-4 backdrop-blur-md transition-all duration-200 hover:shadow-lg">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="border-border bg-muted/50 flex h-12 w-12 items-center justify-center rounded-lg border">
              {instance.icon_path ? (
                <img
                  src={instance.icon_path}
                  alt={instance.name}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <Box className="text-muted-foreground h-6 w-6" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-foreground truncate font-semibold">
                {instance.name}
              </h3>
              <p className="text-muted-foreground text-xs">
                {instance.minecraft_version} · {loaderLabel}
                {instance.loader.version ? ` ${instance.loader.version}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {instance.total_playtime_seconds > 0
              ? `Played: ${playtime}`
              : 'Never played'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setConfirmOpen(true)}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md p-1.5 opacity-0 transition-all group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Button size="sm" disabled className="gap-1.5">
              <Play className="h-3.5 w-3.5" />
              Play
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirm
        instanceName={instance.name}
        open={confirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(instance.id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
