# Window Title Component - Краткое руководство

## 📦 Что было создано

Полнофункциональный кастомный компонент для заголовка окна с кнопками управления (minimize, maximize, close) и полной поддержкой темизации.

## 📁 Файлы

**Компоненты** (`src/shared/ui/window-title/`):
- `window-title.tsx` - компонент заголовка
- `window-controls.tsx` - кнопки управления (minimize, maximize, close)
- `context.tsx` - WindowProvider и useWindowContext
- `window-title-demo.tsx` - демонстрационный компонент со всеми вариантами
- `index.ts` - экспорты
- `README.md` - полная документация

**Конфиг** (`src/shared/config/`):
- `window-title.ts` - CVA варианты для стилей

## 🚀 Быстрый старт

### 1. Базовое использование

```tsx
'use client'

import { WindowProvider, WindowTitle, WindowControls } from '@/shared/ui'

export default function MyApp() {
	return (
		<WindowProvider>
			<div className='flex flex-col border rounded-lg'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<WindowTitle
						title='My App'
						subtitle='v1.0'
					/>
					<WindowControls
						onClose={() => console.log('Close')}
					/>
				</div>

				{/* Content */}
				<div className='p-4'>App content here</div>
			</div>
		</WindowProvider>
	)
}
```

### 2. С вариантами стилей

```tsx
<WindowTitle
	title='Nero Launcher'
	subtitle='Minecraft Launcher'
	variant='primary'    // 'default' | 'primary' | 'secondary' | 'glass'
	size='md'           // 'sm' | 'md' | 'lg'
	padding='normal'    // 'compact' | 'normal' | 'loose'
	textWeight='semibold'
/>

<WindowControls
	size='md'
	gap='normal'        // 'tight' | 'normal' | 'loose'
	isMaximized={false}
	showMinimize={true}
	showMaximize={true}
	showClose={true}
	onMinimize={() => { /* ... */ }}
	onMaximize={() => { /* ... */ }}
	onClose={() => { /* ... */ }}
/>
```

## 🎨 Варианты (Variants)

### WindowTitle

| Параметр | Значения | Описание |
|----------|----------|---------|
| `variant` | default, primary, secondary, glass | Стиль заголовка |
| `size` | sm, md, lg | Высота заголовка |
| `padding` | compact, normal, loose | Отступы внутри |
| `textWeight` | normal, medium, semibold | Толщина шрифта |

### WindowControls

| Параметр | Значения | Описание |
|----------|----------|---------|
| `size` | sm, md, lg | Размер кнопок |
| `gap` | tight, normal, loose | Расстояние между кнопками |
| `showMinimize` | boolean | Показать кнопку минимизации |
| `showMaximize` | boolean | Показать кнопку развертывания |
| `showClose` | boolean | Показать кнопку закрытия |

## 🌈 Темы

Компонент автоматически поддерживает светлую и темную тему через `next-themes`.

**Светлая тема**:
- Светлый фон, темные тексты
- Иконки адаптированы для контраста

**Темная тема**:
- Темный фон, светлые тексты
- Иконки автоматически переключаются

## 🔌 Context API

```tsx
import { useWindowContext } from '@/shared/ui'

function MyComponent() {
	const { isMaximized, isFocused, setIsMaximized } = useWindowContext()

	return (
		<div>
			<p>Окно развернуто: {isMaximized ? 'Да' : 'Нет'}</p>
			<button onClick={() => setIsMaximized(!isMaximized)}>
				Переключить состояние
			</button>
		</div>
	)
}
```

## 📝 Примеры

### Пример 1: Простое окно

```tsx
<WindowProvider>
	<div className='border rounded-lg shadow-lg'>
		<div className='flex justify-between items-center'>
			<WindowTitle title='Simple Window' />
			<WindowControls />
		</div>
		<div className='p-4'>Content</div>
	</div>
</WindowProvider>
```

### Пример 2: Игровой лаунчер (стиль Nero)

```tsx
<WindowProvider>
	<div className='border border-blue-500 rounded-lg'>
		<div className='flex justify-between items-center'>
			<WindowTitle
				title='Nero Launcher'
				subtitle='Minecraft Launcher v2.0'
				variant='primary'
				size='lg'
			/>
			<WindowControls
				size='lg'
				gap='normal'
				onMinimize={() => { /* minimize logic */ }}
				onMaximize={() => { /* maximize logic */ }}
				onClose={() => { /* close logic */ }}
			/>
		</div>
		<div className='p-6 bg-gradient-to-b from-slate-900 to-black'>
			{/* Launcher content */}
		</div>
	</div>
</WindowProvider>
```

### Пример 3: Glass эффект

```tsx
<WindowProvider>
	<div className='relative rounded-lg overflow-hidden'>
		<div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 -z-10' />

		<div className='backdrop-blur-md'>
			<div className='flex justify-between items-center'>
				<WindowTitle
					title='Glass Window'
					variant='glass'
				/>
				<WindowControls />
			</div>
			<div className='p-4 bg-white/10'>Glass content</div>
		</div>
	</div>
</WindowProvider>
```

### Пример 4: Кастомный стиль

```tsx
<WindowTitle
	title='Custom Style'
	className='bg-gradient-to-r from-purple-600 to-pink-600 text-white'
/>

<WindowControls
	className='pr-4'
/>
```

## 🎯 Интеграция с Tauri

Для использования с Tauri window:

```tsx
import { invoke } from '@tauri-apps/api/core'

<WindowControls
	onMinimize={async () => {
		await invoke('minimize_window')
	}}
	onMaximize={async () => {
		await invoke('toggle_maximize_window')
	}}
	onClose={async () => {
		await invoke('close_window')
	}}
/>
```

## 📖 Полная документация

Для полной документации смотрите:
- `src/shared/ui/window-title/README.md`
- `src/shared/ui/window-title/window-title-demo.tsx` (демо компонент)

## 🧪 Демонстрация

Посетите `/test` страницу для просмотра всех вариантов компонента:
- Все варианты стилей
- Все размеры
- Все комбинации параметров
- Примеры использования

## 💡 Ключевые особенности

✅ **CVA Integration** - Управление вариантами через class-variance-authority
✅ **Type-Safe** - Полная TypeScript типизация
✅ **Theme Support** - Светлая/темная тема через next-themes
✅ **Modular** - Каждый компонент отдельно
✅ **Accessible** - Focus states, tooltips, keyboard support
✅ **Customizable** - Все параметры легко кастомизируются
✅ **Performance** - Оптимизирован для production

## 📦 Структура файлов

```
src/
├── shared/
│   ├── config/
│   │   └── window-title.ts         # CVA варианты
│   └── ui/
│       ├── window-title/
│       │   ├── window-title.tsx          # Основной компонент
│       │   ├── window-controls.tsx       # Кнопки
│       │   ├── context.tsx               # Provider
│       │   ├── window-title-demo.tsx     # Demo
│       │   ├── index.ts                  # Экспорты
│       │   └── README.md                 # Документация
│       └── index.ts                      # Экспорты ui
```

---

**Готово к использованию!** 🎉

Компонент полностью интегрирован в проект и готов к использованию в любых окнах приложения.
