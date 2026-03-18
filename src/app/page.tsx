'use client';

import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui';

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight">
          Welcome to Nero Launcher
        </h1>
        <p className="text-muted-foreground mt-3">
          Your unofficial Minecraft launcher. Manage instances, mods, and more.
        </p>
      </div>
      <Link href="/instances">
        <Button className="gap-2">
          <Layers className="h-4 w-4" />
          Go to Instances
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
