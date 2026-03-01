/**
 * Window Title Component - Quick Examples
 *
 * Коллекция готовых примеров для использования Window Title компонента
 */

import { WindowProvider, WindowTitle, WindowControls } from '@/shared/ui'

/**
 * Пример 1: Минимальное использование
 */
export function MinimalExample() {
	return (
		<WindowProvider>
			<div className='border rounded-lg overflow-hidden'>
				<div className='flex justify-between items-center'>
					<WindowTitle title='Simple Window' />
					<WindowControls />
				</div>
				<div className='p-4'>Content here</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 2: С полными параметрами
 */
export function FullExample() {
	return (
		<WindowProvider>
			<div className='border rounded-lg shadow-lg overflow-hidden'>
				<div className='flex justify-between items-center'>
					<WindowTitle
						title='Nero Launcher'
						subtitle='Minecraft Launcher v2.0'
						variant='primary'
						size='md'
						padding='normal'
						textWeight='semibold'
					/>
					<WindowControls
						size='md'
						gap='normal'
						isMaximized={false}
						showMinimize={true}
						showMaximize={true}
						showClose={true}
						onMinimize={() => console.log('Minimized')}
						onMaximize={() => console.log('Maximized')}
						onClose={() => console.log('Closed')}
					/>
				</div>
				<div className='p-4 bg-white dark:bg-slate-900'>
					Launcher content
				</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 3: Glass эффект
 */
export function GlassEffectExample() {
	return (
		<WindowProvider>
			<div className='relative overflow-hidden rounded-lg'>
				{/* Background gradient */}
				<div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 -z-10' />

				{/* Glass container */}
				<div className='backdrop-blur-md'>
					<div className='flex justify-between items-center'>
						<WindowTitle
							title='Glass Effect Window'
							subtitle='With transparency'
							variant='glass'
							size='md'
						/>
						<WindowControls size='md' />
					</div>
					<div className='p-4 bg-white/10 dark:bg-slate-900/20'>
						Glass effect content
					</div>
				</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 4: Все варианты (для демонстрации)
 */
export function AllVariantsExample() {
	return (
		<WindowProvider>
			<div className='space-y-4 p-4'>
				{/* Default variant */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Default Variant' variant='default' />
						<WindowControls />
					</div>
				</div>

				{/* Primary variant */}
				<div className='border border-blue-500 rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Primary Variant' variant='primary' />
						<WindowControls />
					</div>
				</div>

				{/* Secondary variant */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Secondary Variant' variant='secondary' />
						<WindowControls />
					</div>
				</div>

				{/* Glass variant */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Glass Variant' variant='glass' />
						<WindowControls />
					</div>
				</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 5: Все размеры
 */
export function AllSizesExample() {
	return (
		<WindowProvider>
			<div className='space-y-4 p-4'>
				{/* Small */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Small Size' size='sm' />
						<WindowControls size='sm' />
					</div>
				</div>

				{/* Medium (default) */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Medium Size' size='md' />
						<WindowControls size='md' />
					</div>
				</div>

				{/* Large */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Large Size' size='lg' />
						<WindowControls size='lg' />
					</div>
				</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 6: С кастомными обработчиками событий
 */
export function WithHandlersExample() {
	const handleMinimize = () => {
		console.log('Window minimized')
		// Ваша логика минимизирования
	}

	const handleMaximize = () => {
		console.log('Window maximized')
		// Ваша логика развертывания
	}

	const handleClose = () => {
		console.log('Window closed')
		// Ваша логика закрытия
	}

	return (
		<WindowProvider>
			<div className='border rounded-lg overflow-hidden'>
				<div className='flex justify-between items-center'>
					<WindowTitle title='With Event Handlers' />
					<WindowControls
						onMinimize={handleMinimize}
						onMaximize={handleMaximize}
						onClose={handleClose}
					/>
				</div>
				<div className='p-4'>Event handlers are set up</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 7: С интеграцией Tauri
 */
export function TauriIntegrationExample() {
	// Раскомментируйте для использования с Tauri
	// import { invoke } from '@tauri-apps/api/core'

	return (
		<WindowProvider>
			<div className='border rounded-lg overflow-hidden'>
				<div className='flex justify-between items-center'>
					<WindowTitle
						title='Tauri Window'
						subtitle='With Tauri integration'
						variant='primary'
					/>
					<WindowControls
						onMinimize={async () => {
							// await invoke('window_minimize')
							console.log('minimize (Tauri)')
						}}
						onMaximize={async () => {
							// await invoke('window_toggle_maximize')
							console.log('maximize (Tauri)')
						}}
						onClose={async () => {
							// await invoke('window_close')
							console.log('close (Tauri)')
						}}
					/>
				</div>
				<div className='p-4'>Tauri window integration</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 8: С разными padding'ами
 */
export function PaddingVariantsExample() {
	return (
		<WindowProvider>
			<div className='space-y-4 p-4'>
				{/* Compact padding */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Compact Padding' padding='compact' />
						<WindowControls gap='tight' />
					</div>
				</div>

				{/* Normal padding */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Normal Padding' padding='normal' />
						<WindowControls gap='normal' />
					</div>
				</div>

				{/* Loose padding */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Loose Padding' padding='loose' />
						<WindowControls gap='loose' />
					</div>
				</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 9: Только определенные кнопки
 */
export function SelectiveButtonsExample() {
	return (
		<WindowProvider>
			<div className='space-y-4 p-4'>
				{/* Все кнопки */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='All Buttons' />
						<WindowControls
							showMinimize={true}
							showMaximize={true}
							showClose={true}
						/>
					</div>
				</div>

				{/* Только минимизирование и закрытие */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Only Minimize and Close' />
						<WindowControls
							showMinimize={true}
							showMaximize={false}
							showClose={true}
						/>
					</div>
				</div>

				{/* Только закрытие */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle title='Only Close Button' />
						<WindowControls
							showMinimize={false}
							showMaximize={false}
							showClose={true}
						/>
					</div>
				</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Пример 10: Кастомные стили через className
 */
export function CustomStylesExample() {
	return (
		<WindowProvider>
			<div className='space-y-4 p-4'>
				{/* Gradient background */}
				<div className='rounded overflow-hidden'>
					<div className='flex justify-between items-center'>
						<WindowTitle
							title='Gradient Styles'
							className='bg-gradient-to-r from-purple-600 to-pink-600 text-white'
						/>
						<WindowControls className='pr-4' />
					</div>
				</div>

				{/* Custom colors */}
				<div className='border rounded'>
					<div className='flex justify-between items-center'>
						<WindowTitle
							title='Custom Colors'
							className='bg-slate-800 text-yellow-300'
						/>
						<WindowControls />
					</div>
				</div>
			</div>
		</WindowProvider>
	)
}

/**
 * Экспорт всех примеров
 */
export const Examples = {
	Minimal: MinimalExample,
	Full: FullExample,
	GlassEffect: GlassEffectExample,
	AllVariants: AllVariantsExample,
	AllSizes: AllSizesExample,
	WithHandlers: WithHandlersExample,
	TauriIntegration: TauriIntegrationExample,
	PaddingVariants: PaddingVariantsExample,
	SelectiveButtons: SelectiveButtonsExample,
	CustomStyles: CustomStylesExample
}
