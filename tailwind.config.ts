import type { Config } from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}'
	],
	plugins: []
} satisfies Config
