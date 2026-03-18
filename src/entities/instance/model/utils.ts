import type { LoaderType } from './types';

export function getRequiredJavaMajor(minecraftVersion: string): 8 | 17 | 21 {
  const parts = minecraftVersion.split('.');
  const major = parseInt(parts[1] ?? '0', 10);
  const patch = parseInt(parts[2] ?? '0', 10);

  if (major < 17) return 8;
  if (major === 17 && patch === 0) return 17;
  if (major <= 20) return 17;
  return 21;
}

export function formatPlaytime(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function getLoaderLabel(loaderType: LoaderType): string {
  const labels: Record<LoaderType, string> = {
    vanilla: 'Vanilla',
    fabric: 'Fabric',
    forge: 'Forge',
    neoforge: 'NeoForge',
    quilt: 'Quilt',
    optifine: 'OptiFine',
  };
  return labels[loaderType];
}
