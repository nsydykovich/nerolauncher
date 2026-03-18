'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useInstances } from '@/features/instance-manager';
import {
  MinecraftVersionSelect,
  LoaderVersionSelect,
} from '@/features/version-picker';
import type { LoaderType } from '@/entities/instance';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';

const LOADER_OPTIONS: { value: LoaderType; label: string }[] = [
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'fabric', label: 'Fabric' },
  { value: 'quilt', label: 'Quilt' },
  { value: 'forge', label: 'Forge' },
  { value: 'neoforge', label: 'NeoForge' },
];

export function CreateInstanceView() {
  const router = useRouter();
  const { create } = useInstances();

  const [name, setName] = useState('');
  const [mcVersion, setMcVersion] = useState('1.21.1');
  const [loaderType, setLoaderType] = useState<LoaderType>('vanilla');
  const [loaderVersion, setLoaderVersion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mcVersion) return;

    try {
      setSubmitting(true);
      setError(null);
      await create({
        name: name.trim(),
        minecraft_version: mcVersion,
        loader: { type: loaderType, version: loaderVersion || null },
      });
      router.push('/instances');
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <Link
          href="/instances"
          className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Instances
        </Link>
        <h1 className="text-foreground text-2xl font-bold">New Instance</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create a new Minecraft instance with its own mods, saves, and config.
        </p>
      </div>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Instance Name"
            placeholder="My Survival World"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <MinecraftVersionSelect
            value={mcVersion}
            onChange={(v) => {
              setMcVersion(v);
              setLoaderVersion('');
            }}
          />

          <div className="space-y-1.5">
            <label className="text-foreground text-sm font-medium">
              Mod Loader
            </label>
            <div className="flex flex-wrap gap-2">
              {LOADER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setLoaderType(opt.value);
                    setLoaderVersion('');
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    loaderType === opt.value
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loaderType !== 'vanilla' && (
            <LoaderVersionSelect
              loaderType={loaderType}
              mcVersion={mcVersion}
              value={loaderVersion}
              onChange={setLoaderVersion}
            />
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!name.trim() || !mcVersion || submitting}
            >
              {submitting ? 'Creating…' : 'Create Instance'}
            </Button>
            <Link href="/instances">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
