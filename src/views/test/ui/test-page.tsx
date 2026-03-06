'use client'

import * as React from 'react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/shared/ui/card'
import { Input, Label } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Switch } from '@/shared/ui/switch'
import { Separator } from '@/shared/ui/separator'
import { cn } from '@/shared/lib/utils'
import {
    Loader2, Trash2, Plus, Settings, Check, AlertCircle, Info,
    Palette, Type, Layout, ToggleLeft, Minus, ChevronDown,
} from 'lucide-react'

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ id, title, description, children }: {
    id: string; title: string; description?: string; children: React.ReactNode
}) {
    return (
        <section id={id} className='scroll-mt-4'>
            <div className='mb-4'>
                <h2 className='text-lg font-semibold'>{title}</h2>
                {description && <p className='text-sm text-muted-foreground mt-0.5'>{description}</p>}
            </div>
            {children}
        </section>
    )
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>
}

function CodeBlock({ children }: { children: string }) {
    return (
        <pre className='mt-3 rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground overflow-x-auto font-mono'>
            {children}
        </pre>
    )
}

// ── Sidebar nav ────────────────────────────────────────────────────────────────

const SECTIONS = [
    { id: 'buttons',    label: 'Buttons',    icon: Layout     },
    { id: 'badges',     label: 'Badges',     icon: Palette    },
    { id: 'cards',      label: 'Cards',      icon: Layout     },
    { id: 'inputs',     label: 'Inputs',     icon: Type       },
    { id: 'controls',   label: 'Controls',   icon: ToggleLeft },
    { id: 'separators', label: 'Separators', icon: Minus      },
    { id: 'typography', label: 'Typography', icon: Type       },
    { id: 'colors',     label: 'Colors',     icon: Palette    },
]

// ── Main view ─────────────────────────────────────────────────────────────────

export function TestPage() {
    const [switchA, setSwitchA] = React.useState(false)
    const [switchB, setSwitchB] = React.useState(true)
    const [active, setActive] = React.useState('buttons')

    const scrollTo = (id: string) => {
        setActive(id)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className='flex h-full overflow-hidden bg-background text-foreground'>
            {/* Sidebar */}
            <aside className='w-48 shrink-0 border-r border-border bg-sidebar p-3 overflow-y-auto'>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2'>
                    Components
                </p>
                <nav className='space-y-0.5'>
                    {SECTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => scrollTo(id)}
                            className={cn(
                                'w-full text-left flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                                active === id
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                            )}
                        >
                            <Icon className='h-3.5 w-3.5 shrink-0 opacity-60' />
                            {label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <main className='flex-1 overflow-y-auto p-8 space-y-12'>

                {/* ── Buttons ── */}
                <Section id='buttons' title='Buttons' description='Button variants, sizes and states'>
                    <div className='space-y-4'>
                        <div>
                            <p className='text-xs text-muted-foreground mb-2 font-medium'>Variants</p>
                            <Row>
                                <Button variant='default'>Default</Button>
                                <Button variant='primary'>Primary</Button>
                                <Button variant='secondary'>Secondary</Button>
                                <Button variant='outline'>Outline</Button>
                                <Button variant='ghost'>Ghost</Button>
                                <Button variant='destructive'>Destructive</Button>
                            </Row>
                        </div>
                        <div>
                            <p className='text-xs text-muted-foreground mb-2 font-medium'>Sizes</p>
                            <Row className='items-end'>
                                <Button size='sm'>Small</Button>
                                <Button size='md'>Medium</Button>
                                <Button size='lg'>Large</Button>
                            </Row>
                        </div>
                        <div>
                            <p className='text-xs text-muted-foreground mb-2 font-medium'>States</p>
                            <Row>
                                <Button disabled>Disabled</Button>
                                <Button loading>Loading</Button>
                                <Button variant='primary'>
                                    <Plus className='h-4 w-4 mr-1' /> With Icon
                                </Button>
                                <Button variant='outline'>
                                    <Settings className='h-4 w-4 mr-1' /> Settings
                                </Button>
                                <Button variant='destructive'>
                                    <Trash2 className='h-4 w-4 mr-1' /> Delete
                                </Button>
                            </Row>
                        </div>
                        <div>
                            <p className='text-xs text-muted-foreground mb-2 font-medium'>Icon only</p>
                            <Row>
                                <Button variant='ghost' size='sm' className='w-8 p-0'><Plus className='h-4 w-4' /></Button>
                                <Button variant='outline' size='sm' className='w-8 p-0'><Settings className='h-4 w-4' /></Button>
                                <Button variant='destructive' size='sm' className='w-8 p-0'><Trash2 className='h-4 w-4' /></Button>
                            </Row>
                        </div>
                    </div>
                    <CodeBlock>{`<Button variant="primary" size="md">Primary</Button>
<Button variant="outline" loading>Loading</Button>
<Button disabled>Disabled</Button>`}</CodeBlock>
                </Section>

                <Separator />

                {/* ── Badges ── */}
                <Section id='badges' title='Badges' description='Status indicators and labels'>
                    <div className='space-y-4'>
                        <div>
                            <p className='text-xs text-muted-foreground mb-2 font-medium'>Variants</p>
                            <Row>
                                <Badge variant='default'>Default</Badge>
                                <Badge variant='primary'>Primary</Badge>
                                <Badge variant='secondary'>Secondary</Badge>
                                <Badge variant='destructive'>Destructive</Badge>
                                <Badge variant='outline'>Outline</Badge>
                            </Row>
                        </div>
                        <div>
                            <p className='text-xs text-muted-foreground mb-2 font-medium'>Sizes</p>
                            <Row className='items-center'>
                                <Badge size='sm'>Small</Badge>
                                <Badge size='md'>Medium</Badge>
                            </Row>
                        </div>
                        <div>
                            <p className='text-xs text-muted-foreground mb-2 font-medium'>In context</p>
                            <Row>
                                <span className='flex items-center gap-2 text-sm'>
                                    Status <Badge variant='primary'>Active</Badge>
                                </span>
                                <span className='flex items-center gap-2 text-sm'>
                                    Version <Badge variant='outline'>v1.0.0</Badge>
                                </span>
                                <span className='flex items-center gap-2 text-sm'>
                                    Alert <Badge variant='destructive'>Error</Badge>
                                </span>
                            </Row>
                        </div>
                    </div>
                </Section>

                <Separator />

                {/* ── Cards ── */}
                <Section id='cards' title='Cards' description='Container components with sub-parts'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>With shadow and background</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className='text-sm text-muted-foreground'>
                                    Card content goes here. Any children are allowed.
                                </p>
                            </CardContent>
                            <CardFooter className='gap-2'>
                                <Button size='sm' variant='outline'>Cancel</Button>
                                <Button size='sm'>Confirm</Button>
                            </CardFooter>
                        </Card>

                        <Card variant='outline'>
                            <CardHeader>
                                <CardTitle>Outline Card</CardTitle>
                                <CardDescription>Border only, no shadow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Row>
                                    <Badge variant='primary'>Active</Badge>
                                    <Badge variant='outline'>Tag</Badge>
                                </Row>
                            </CardContent>
                        </Card>

                        <Card variant='ghost'>
                            <CardHeader>
                                <CardTitle>Ghost Card</CardTitle>
                                <CardDescription>Transparent background</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className='text-sm text-muted-foreground'>No background, no border.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <CardTitle>Minecraft 1.21.4</CardTitle>
                                        <CardDescription>Vanilla profile</CardDescription>
                                    </div>
                                    <Badge variant='primary' size='sm'>Ready</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <Check className='h-4 w-4 text-green-500' />
                                    Java 21 detected
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className='w-full' variant='primary'>Launch</Button>
                            </CardFooter>
                        </Card>

                        <Card className='border-destructive/50 bg-destructive/5'>
                            <CardHeader>
                                <div className='flex items-center gap-2'>
                                    <AlertCircle className='h-4 w-4 text-destructive' />
                                    <CardTitle className='text-sm text-destructive'>Error</CardTitle>
                                </div>
                                <CardDescription>Java not found on your system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button size='sm' variant='outline'>Fix issue</Button>
                            </CardContent>
                        </Card>

                        <Card className='border-blue-500/30 bg-blue-500/5'>
                            <CardHeader>
                                <div className='flex items-center gap-2'>
                                    <Info className='h-4 w-4 text-blue-500' />
                                    <CardTitle className='text-sm text-blue-600 dark:text-blue-400'>Info</CardTitle>
                                </div>
                                <CardDescription>Update available: v2.0.0</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button size='sm' variant='outline'>Update now</Button>
                            </CardContent>
                        </Card>
                    </div>
                </Section>

                <Separator />

                {/* ── Inputs ── */}
                <Section id='inputs' title='Inputs' description='Form controls and labels'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl'>
                        <div className='space-y-2'>
                            <Label htmlFor='ex1'>Default input</Label>
                            <Input id='ex1' placeholder='Type something…' />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='ex2'>With value</Label>
                            <Input id='ex2' defaultValue='nero@launcher.dev' />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='ex3'>Password</Label>
                            <Input id='ex3' type='password' placeholder='Password' />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='ex4'>Disabled</Label>
                            <Input id='ex4' disabled placeholder='Disabled' />
                        </div>
                        <div className='space-y-2 sm:col-span-2'>
                            <Label htmlFor='ex5'>Select</Label>
                            <Select id='ex5' className='max-w-xs'>
                                <option>Minecraft 1.21.4</option>
                                <option>Minecraft 1.20.6</option>
                                <option>Minecraft 1.19.4</option>
                                <option>Fabric 1.21.4</option>
                            </Select>
                        </div>
                    </div>
                </Section>

                <Separator />

                {/* ── Controls ── */}
                <Section id='controls' title='Controls' description='Toggle switches'>
                    <div className='space-y-4'>
                        <div className='flex items-center gap-4'>
                            <Switch checked={switchA} onCheckedChange={setSwitchA} id='sw1' />
                            <Label htmlFor='sw1'>Off → click to toggle ({switchA ? 'on' : 'off'})</Label>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Switch checked={switchB} onCheckedChange={setSwitchB} id='sw2' />
                            <Label htmlFor='sw2'>On by default ({switchB ? 'on' : 'off'})</Label>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Switch checked disabled />
                            <Label className='opacity-50'>Disabled (on)</Label>
                        </div>
                        <div className='flex items-center gap-4'>
                            <Switch disabled />
                            <Label className='opacity-50'>Disabled (off)</Label>
                        </div>
                    </div>

                    {/* Realistic example */}
                    <div className='mt-6 max-w-md space-y-3'>
                        <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3'>
                            In a settings card
                        </p>
                        {[
                            { label: 'Auto-update launcher', desc: 'Download updates automatically' },
                            { label: 'Show notifications',   desc: 'Desktop notifications on launch'  },
                            { label: 'Hardware acceleration', desc: 'Use GPU for rendering'            },
                        ].map((item) => (
                            <Card key={item.label} variant='outline'>
                                <CardHeader className='py-3'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-sm font-medium'>{item.label}</p>
                                            <p className='text-xs text-muted-foreground'>{item.desc}</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </Section>

                <Separator />

                {/* ── Separators ── */}
                <Section id='separators' title='Separators' description='Horizontal and vertical dividers'>
                    <div className='space-y-6 max-w-md'>
                        <div>
                            <p className='text-xs text-muted-foreground mb-3 font-medium'>Horizontal</p>
                            <p className='text-sm mb-3'>Section A</p>
                            <Separator />
                            <p className='text-sm mt-3'>Section B</p>
                        </div>
                        <div>
                            <p className='text-xs text-muted-foreground mb-3 font-medium'>Vertical</p>
                            <div className='flex items-center gap-3 h-6'>
                                <span className='text-sm'>Item A</span>
                                <Separator orientation='vertical' />
                                <span className='text-sm'>Item B</span>
                                <Separator orientation='vertical' />
                                <span className='text-sm'>Item C</span>
                            </div>
                        </div>
                    </div>
                </Section>

                <Separator />

                {/* ── Typography ── */}
                <Section id='typography' title='Typography' description='Type scale and text styles'>
                    <div className='space-y-3 max-w-xl'>
                        <p className='text-4xl font-bold tracking-tight'>Heading 4xl</p>
                        <p className='text-3xl font-bold'>Heading 3xl</p>
                        <p className='text-2xl font-semibold'>Heading 2xl</p>
                        <p className='text-xl font-semibold'>Heading xl</p>
                        <p className='text-lg font-medium'>Heading lg</p>
                        <Separator />
                        <p className='text-base'>Base text — The quick brown fox jumps over the lazy dog.</p>
                        <p className='text-sm'>Small text — The quick brown fox jumps over the lazy dog.</p>
                        <p className='text-xs'>Extra small — The quick brown fox jumps over the lazy dog.</p>
                        <Separator />
                        <p className='text-sm text-muted-foreground'>Muted foreground text</p>
                        <p className='text-sm font-mono'>Monospace font for code</p>
                        <p className='text-sm font-bold'>Bold weight</p>
                        <p className='text-sm italic'>Italic style</p>
                        <code className='rounded bg-muted px-1.5 py-0.5 text-xs font-mono'>inline code</code>
                    </div>
                </Section>

                <Separator />

                {/* ── Colors ── */}
                <Section id='colors' title='Colors' description='Theme color tokens'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
                        {[
                            { name: 'background',      bg: 'bg-background',      text: 'text-foreground'           },
                            { name: 'foreground',       bg: 'bg-foreground',      text: 'text-background'           },
                            { name: 'card',             bg: 'bg-card',            text: 'text-card-foreground'      },
                            { name: 'primary',          bg: 'bg-primary',         text: 'text-primary-foreground'   },
                            { name: 'secondary',        bg: 'bg-secondary',       text: 'text-secondary-foreground' },
                            { name: 'muted',            bg: 'bg-muted',           text: 'text-muted-foreground'     },
                            { name: 'accent',           bg: 'bg-accent',          text: 'text-accent-foreground'    },
                            { name: 'destructive',      bg: 'bg-destructive',     text: 'text-white'                },
                            { name: 'sidebar',          bg: 'bg-sidebar',         text: 'text-sidebar-foreground'   },
                            { name: 'sidebar-accent',   bg: 'bg-sidebar-accent',  text: 'text-sidebar-accent-foreground' },
                            { name: 'border',           bg: 'bg-border',          text: 'text-foreground'           },
                            { name: 'ring',             bg: 'bg-ring',            text: 'text-foreground'           },
                        ].map(({ name, bg, text }) => (
                            <div key={name} className={cn('rounded-lg p-3 border border-border', bg)}>
                                <p className={cn('text-xs font-mono font-medium', text)}>{name}</p>
                            </div>
                        ))}
                    </div>
                    <div className='mt-4'>
                        <p className='text-xs text-muted-foreground mb-3 font-medium'>Accent color (CSS var)</p>
                        <div
                            className='h-10 w-48 rounded-lg'
                            style={{ backgroundColor: 'var(--accent-color, oklch(0.55 0.22 250))' }}
                        />
                    </div>
                </Section>

                {/* bottom padding */}
                <div className='h-8' />
            </main>
        </div>
    )
}
