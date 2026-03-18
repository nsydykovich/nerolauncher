'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { Instance } from '@/entities/instance';
import { InstanceCard } from '@/widgets/instance-card';

interface InstanceGridProps {
  instances: Instance[];
  onDelete: (id: string) => void;
}

export function InstanceGrid({ instances, onDelete }: InstanceGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Link
        href="/instances/new"
        className="group border-border bg-card/20 hover:border-primary/50 hover:bg-card/40 flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-all duration-200"
      >
        <div className="border-border bg-muted/50 group-hover:border-primary/50 group-hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full border transition-colors">
          <Plus className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
        </div>
        <span className="text-muted-foreground group-hover:text-primary text-sm font-medium transition-colors">
          New Instance
        </span>
      </Link>

      {instances.map((instance) => (
        <InstanceCard
          key={instance.id}
          instance={instance}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
