# Window Title Component

Полнофункциональный кастомный компонент заголовка окна с кнопками управления (minimize, maximize, close) и поддержкой темизации.

## Архитектура

Компонент состоит из следующих частей:

- **WindowProvider** - Context provider для управления состоянием окна
- **WindowTitle** - Основной компонент заголовка окна
- **WindowControls** - Компонент с кнопками управления окном
- **WindowControlButton** - Отдельная кнопка управления
- **Конфиг** - CVA варианты с поддержкой всех стилевых опций

## Использование

### Базовый пример

```tsx
'use client'

import { WindowProvider, WindowTitle, WindowControls } from '@/shared/ui'

export function MyWindow() {
	return (
		<WindowProvider>
			<div className='flex flex-col'>
				<div className='flex items-center justify-between'>
					<WindowTitle title='Мое окно' subtitle='Подзаголовок' />
					<WindowControls
						onMinimize={() => console.log('Minimize')}
						onMaximize={() => console.log('Maximize')}
						onClose={() => console.log('Close')}
					/>
				</div>
				{/* Содержимое окна */}
			</div>
		</WindowProvider>
	)
}
```

### С Props

```tsx
<WindowTitle
	title='Заголовок'
	subtitle='Подзаголовок'
	variant='primary' // 'default' | 'primary' | 'secondary' | 'glass'
	size='md' // 'sm' | 'md' | 'lg'
	padding='normal' // 'compact' | 'normal' | 'loose'
/>

<WindowControls
	size='md' // размер кнопок
	gap='normal' // 'tight' | 'normal' | 'loose'
	isMaximized={false}
	showMinimize={true}
	showMaximize={true}
	showClose={true}
	onMinimize={() => {}}
	onMaximize={() => {}}
	onClose={() => {}}
/>
```

## Варианты (Variants)

### WindowTitle Варианты

#### `variant`
- **default** - стандартный вид с border-bottom
- **primary** - синий вариант (primary color)
- **secondary** - светлый вариант
- **glass** - прозрачный эффект с backdrop blur

#### `size`
- **sm** - маленький размер (min-h-8)
- **md** - стандартный размер (min-h-10)
- **lg** - большой размер (min-h-12)

#### `padding`
- **compact** - минимальный отступ (px-2 py-1)
- **normal** - стандартный отступ (px-4 py-3)
- **loose** - большой отступ (px-6 py-4)

### WindowControls Варианты

#### `size`
- **sm** - маленькие кнопки (w-6 h-6)
- **md** - стандартные кнопки (w-8 h-8)
- **lg** - большие кнопки (w-10 h-10)

#### `gap`
- **tight** - без промежутков
- **normal** - стандартный промежуток (gap-1)
- **loose** - большой промежуток (gap-2)

## Темизация

Компонент полностью интегрирован с `next-themes`:

### Светлая тема
- Светлый фон (bg-background)
- Темные тексты
- Светлые иконки

### Темная тема
- Темный фон (dark:bg-slate-900)
- Светлые тексты
- Контрастные иконки

Все цвета автоматически переключаются при изменении темы.

## Context API

### useWindowContext

Хук для доступа к состоянию окна:

```tsx
const { isMaximized, isFocused, isDragging, setIsMaximized, setIsFocused, setIsDragging } = useWindowContext()
```

**Свойства:**
- `isMaximized: boolean` - развернуто ли окно
- `isFocused: boolean` - активно ли окно
- `isDragging: boolean` - перетаскивается ли окно
- `setIsMaximized: (value: boolean) => void` - изменить состояние
- `setIsFocused: (value: boolean) => void` - изменить фокус
- `setIsDragging: (value: boolean) => void` - изменить состояние перетаскивания

## Особенности

✅ **CVA Integration** - использует class-variance-authority для управления вариантами
✅ **Theme Support** - полная поддержка светлой/темной темы
✅ **Context Provider** - состояние окна управляется через Context
✅ **Tailwind CSS** - полная интеграция с Tailwind
✅ **Accessibility** - поддержка focus states и keyboard interactions
✅ **TypeScript** - полная типизация всех компонентов
✅ **Modular** - каждый компонент отдельно и может использоваться независимо

## Примеры использования

### Пример 1: Простое окно

```tsx
<WindowProvider>
	<div className='border'>
		<div className='flex justify-between'>
			<WindowTitle title='Простое окно' />
			<WindowControls />
		</div>
		<div className='p-4'>Содержимое</div>
	</div>
</WindowProvider>
```

### Пример 2: С кастомными обработчиками

```tsx
<WindowProvider>
	<div className='border'>
		<div className='flex justify-between'>
			<WindowTitle
				title='Кастомное окно'
				variant='primary'
				size='lg'
			/>
			<WindowControls
				onMinimize={() => {
					// логика минимизирования
				}}
				onMaximize={() => {
					// логика развертывания
				}}
				onClose={() => {
					// логика закрытия
				}}
			/>
		</div>
		<div className='p-4'>Содержимое</div>
	</div>
</WindowProvider>
```

### Пример 3: Glass эффект

```tsx
<WindowProvider>
	<div className='relative overflow-hidden rounded-lg'>
		<div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 -z-10' />
		<div className='backdrop-blur-sm'>
			<div className='flex justify-between'>
				<WindowTitle
					title='Glass Effect'
					subtitle='С прозрачностью'
					variant='glass'
				/>
				<WindowControls />
			</div>
			<div className='p-4 bg-white/50 dark:bg-slate-900/50'>Содержимое</div>
		</div>
	</div>
</WindowProvider>
```

## Файловая структура

```
src/shared/ui/window-title/
├── index.ts                 # Экспорты
├── context.tsx              # WindowProvider и useWindowContext
├── window-title.tsx         # Основной компонент
├── window-controls.tsx      # Кнопки управления
├── window-title-demo.tsx    # Demo компонент
└── README.md                # Документация

src/shared/config/
└── window-title.ts          # CVA варианты
```

## Интеграция с Tauri

Для использования с Tauri окном можно подключить обработчики команд:

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

## Кастомизация

Все стили можно переопределить через className:

```tsx
<WindowTitle
	title='Кастомное'
	className='bg-red-500 text-white'
/>

<WindowControls
	className='pr-2'
/>
```
