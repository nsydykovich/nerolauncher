'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Moon, Sun, User, Pencil } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useProfile } from '@/features/profile-manager';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/instances', label: 'Instances', icon: Layers },
];

export function Sidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { profile, setUsername } = useProfile();
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      await setUsername(usernameInput.trim());
      setEditingUsername(false);
      setUsernameInput('');
    }
  };

  return (
    <aside className="border-border bg-sidebar/50 flex h-full w-56 shrink-0 flex-col border-r backdrop-blur-md">
      <div className="border-border flex h-14 items-center border-b px-4">
        <span className="text-foreground font-semibold tracking-tight">
          Nero Launcher
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-2 pt-3">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-border space-y-2 border-t p-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium">
            Theme
          </span>
          <button
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-md p-1.5 transition-colors"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="border-border bg-muted/20 rounded-lg border p-2">
          {editingUsername ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-1.5">
              <Input
                placeholder="Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                autoFocus
              />
              <div className="flex gap-1.5">
                <Button type="submit" size="sm" className="flex-1 text-xs">
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setEditingUsername(false);
                    setUsernameInput('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 flex h-7 w-7 items-center justify-center rounded-full">
                <User className="text-primary h-4 w-4" />
              </div>
              <span className="text-foreground flex-1 truncate text-sm">
                {profile?.username ?? 'Set username'}
              </span>
              <button
                onClick={() => {
                  setUsernameInput(profile?.username ?? '');
                  setEditingUsername(true);
                }}
                className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
