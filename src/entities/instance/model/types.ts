export type LoaderType =
  | 'vanilla'
  | 'fabric'
  | 'forge'
  | 'neoforge'
  | 'quilt'
  | 'optifine';
export type InstanceStatus =
  | 'idle'
  | 'launching'
  | 'running'
  | 'downloading'
  | 'error';

export interface LoaderConfig {
  type: LoaderType;
  version: string | null;
}

export interface GameResolution {
  width: number;
  height: number;
}

export interface Instance {
  id: string;
  name: string;
  icon_path: string | null;
  minecraft_version: string;
  loader: LoaderConfig;
  created_at: string;
  last_played_at: string | null;
  total_playtime_seconds: number;
  path: string;
  java_override_path: string | null;
  jvm_args: string[];
  game_resolution: GameResolution | null;
}

export interface CreateInstanceInput {
  name: string;
  minecraft_version: string;
  loader: LoaderConfig;
}
