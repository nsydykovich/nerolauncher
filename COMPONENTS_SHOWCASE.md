# Components Showcase

## Window Title Component

Полнофункциональный кастомный компонент для управления окном с поддержкой темизации.

### 📊 Визуальные варианты

#### Варианты стилей (Variants)

```
╔═══════════════════════════════════════════════════════════════╗
║ DEFAULT WINDOW                                      _ □ ✕     ║
║ This is a default window title                                 ║
╚═══════════════════════════════════════════════════════════════╝
```

```
╔═══════════════════════════════════════════════════════════════╗
║ PRIMARY WINDOW (BLUE)                              _ □ ✕     ║
║ This is a primary window title                                 ║
╚═══════════════════════════════════════════════════════════════╝
```

```
╔═══════════════════════════════════════════════════════════════╗
║ SECONDARY WINDOW                                   _ □ ✕     ║
║ This is a secondary window title                               ║
╚═══════════════════════════════════════════════════════════════╝
```

```
╔═══════════════════════════════════════════════════════════════╗
║ GLASS EFFECT WINDOW (TRANSPARENT)                  _ □ ✕     ║
║ This window has a glass effect                                 ║
╚═══════════════════════════════════════════════════════════════╝
```

#### Размеры (Sizes)

```
┌────────────────────────────────────────────────────┐
│ sm  _ □ ✕                           (Small)        │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ Medium Window                       _ □ ✕          │ (Medium)
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│                                                     │
│ Large Window                        _ □ ✕          │ (Large)
│                                                     │
└────────────────────────────────────────────────────┘
```

#### Padding вариации

```
┌─────────────────────────────────────────────────────┐
│Compact padding                    _ □ ✕│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Normal padding                    _ □ ✕          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│      Loose padding                 _ □ ✕           │
└─────────────────────────────────────────────────────┘
```

### 🎨 Цветовые схемы

#### Светлая тема (Light)
```
Background:    #ffffff (white)
Text:          #1f2937 (dark gray)
Border:        #e5e7eb (light gray)
Primary:       #3b82f6 (blue)
Hover:         #f3f4f6 (light gray)
```

#### Темная тема (Dark)
```
Background:    #0f172a (slate-900)
Text:          #f1f5f9 (light slate)
Border:        #1e293b (slate-700)
Primary:       #1e40af (dark blue)
Hover:         #1e293b (dark gray)
```

### 🔘 Кнопки управления

```
┌──────────────────────────────────────────────────────┐
│ Window Title              [_]  [□]  [✕]              │
└──────────────────────────────────────────────────────┘
   minimize  maximize   close
    (yellow)  (green)  (red)
```

#### Кнопки по отдельности

```
Minimize Button:
┌─────────┐
│    _    │  ← Hover: с полупрозрачным фоном
└─────────┘
  tooltip: "Minimize"

Maximize Button:
┌─────────┐
│    □    │  ← Hover: с полупрозрачным фоном
└─────────┘
  tooltip: "Maximize"

Close Button:
┌─────────┐
│    ✕    │  ← Hover: с красным фоном (danger)
└─────────┘
  tooltip: "Close"
```

### 📱 Полный пример окна

```
╔═══════════════════════════════════════════════════════════════╗
║ Nero Launcher                                      _ □ ✕      ║
║ Minecraft Launcher                                             ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                 ║
║   🎮 Minecraft Launcher                                        ║
║                                                                 ║
║   Version: 1.20.4          Play ▶                              ║
║   Profile: Default                                              ║
║                                                                 ║
║   ┌────────────────────────────────────────────────────────┐  ║
║   │ News                                                    │  ║
║   │ • New update available                                  │  ║
║   │ • Download: 250 MB                                      │  ║
║   └────────────────────────────────────────────────────────┘  ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝
```

### 🔄 Состояния

```
NORMAL (Focused)
┌──────────────────────────────────────┐
│ Window Title                _ □ ✕     │  (full opacity)
└──────────────────────────────────────┘

UNFOCUSED
┌──────────────────────────────────────┐
│ Window Title                _ □ ✕     │  (60% opacity)
└──────────────────────────────────────┘

DRAGGING
┌──────────────────────────────────────┐
│ Window Title                _ □ ✕     │  (90% opacity)
└──────────────────────────────────────┘

MAXIMIZED
┌─────────────────────────────────────────────────────────────────┐
│ Window Title                                         _ □ ✕       │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Использование в коде

### Импорт

```typescript
import {
	WindowProvider,
	WindowTitle,
	WindowControls,
	useWindowContext
} from '@/shared/ui'
```

### Структура компонента

```
WindowProvider (Context wrapper)
  ├── App Component
      ├── WindowTitle
      │   ├── Title text
      │   └── Subtitle text
      └── WindowControls
          ├── MinimizeButton
          ├── MaximizeButton
          └── CloseButton
```

### Пример JSX

```jsx
<WindowProvider>
	<div className="border rounded-lg shadow-lg overflow-hidden">
		{/* Header with controls */}
		<div className="flex items-center justify-between">
			<WindowTitle
				title="Nero Launcher"
				subtitle="Minecraft Launcher v2.0"
				variant="primary"
				size="md"
				padding="normal"
			/>
			<WindowControls
				size="md"
				gap="normal"
				isMaximized={false}
				onMinimize={() => console.log('minimize')}
				onMaximize={() => console.log('maximize')}
				onClose={() => console.log('close')}
			/>
		</div>

		{/* Main content */}
		<div className="p-4 bg-white dark:bg-slate-900">
			{/* Your content here */}
		</div>
	</div>
</WindowProvider>
```

## 🎨 CVA Варианты

### WindowTitle CVA

```typescript
variant: 'default' | 'primary' | 'secondary' | 'glass'
size: 'sm' | 'md' | 'lg'
padding: 'compact' | 'normal' | 'loose'
```

### WindowControls CVA

```typescript
size: 'sm' | 'md' | 'lg'
gap: 'tight' | 'normal' | 'loose'
```

### Button CVA

```typescript
variant: 'default' | 'danger' | 'minimize' | 'maximize'
size: 'sm' | 'md' | 'lg'
```

## 🌐 Темизация

### Автоматическое переключение темы

```typescript
// Используется next-themes под капотом
// Темы переключаются автоматически через:
// - System preference
// - User selection
// - localStorage
```

### Пример с управлением темой

```tsx
'use client'

import { useTheme } from 'next-themes'
import { WindowProvider, WindowTitle } from '@/shared/ui'

export function App() {
	const { theme, setTheme } = useTheme()

	return (
		<WindowProvider>
			<div>
				<WindowTitle
					title={`Theme: ${theme}`}
					variant={theme === 'dark' ? 'secondary' : 'primary'}
				/>
				<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
					Toggle Theme
				</button>
			</div>
		</WindowProvider>
	)
}
```

## 📦 Файловая структура

```
src/shared/
├── config/
│   └── window-title.ts
│       ├── windowTitleVariants (CVA)
│       ├── windowTitleButtonVariants (CVA)
│       ├── windowTitleTextVariants (CVA)
│       └── windowControlsContainerVariants (CVA)
│
└── ui/
    ├── window-title/
    │   ├── context.tsx
    │   │   ├── WindowContext
    │   │   ├── WindowProvider
    │   │   └── useWindowContext()
    │   │
    │   ├── window-title.tsx
    │   │   └── WindowTitle component
    │   │
    │   ├── window-controls.tsx
    │   │   ├── WindowControlButton component
    │   │   └── WindowControls component
    │   │
    │   ├── window-title-demo.tsx
    │   │   └── WindowTitleDemo component
    │   │
    │   ├── index.ts
    │   │   └── Exports
    │   │
    │   └── README.md
    │       └── Full documentation
    │
    └── index.ts
        └── UI exports
```

## 🚀 Производительность

- ✅ Используется React.forwardRef для прямого доступа к DOM
- ✅ Мемоизация через Context prevents unnecessary re-renders
- ✅ Минимальные зависимости
- ✅ Оптимизирован для production builds

## ♿ Доступность

- ✅ Поддержка focus states
- ✅ Tooltips на кнопках
- ✅ Keyboard navigation
- ✅ ARIA attributes (где нужно)
- ✅ Контрастные цвета

## 🔗 Интеграция

### С Tauri

```tsx
import { invoke } from '@tauri-apps/api/core'

<WindowControls
	onMinimize={() => invoke('window_minimize')}
	onMaximize={() => invoke('window_toggle_maximize')}
	onClose={() => invoke('window_close')}
/>
```

### С Next.js

```tsx
import { useRouter } from 'next/navigation'

<WindowControls
	onClose={() => router.push('/')}
/>
```

### С Redux/Zustand

```tsx
import { useAppStore } from '@/store'

<WindowControls
	onMinimize={() => useAppStore.setState({ windowMinimized: true })}
/>
```

## 📚 Дополнительные ресурсы

- Полная документация: `src/shared/ui/window-title/README.md`
- Demo компонент: `src/shared/ui/window-title/window-title-demo.tsx`
- Быстрый старт: `WINDOW_TITLE_GUIDE.md`
- Тестовая страница: `/test`

---

**Component Status**: ✅ Production Ready
**Last Updated**: 2026-03-01
**Version**: 1.0.0
