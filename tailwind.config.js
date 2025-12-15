/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#5d4a78',
					light: '#7A6294',
					dark: '#453659',
					faded: 'rgba(93, 74, 120, 0.08)'
				},
				secondary: {
					DEFAULT: '#5a9fa2',
					light: '#70BABE',
					dark: '#4a8588'
				},
				accent: {
					pink: '#C85399',
					green: '#4FB161',
					lime: '#D5D945'
				},
				text: {
					DEFAULT: '#3d3a42',
					light: '#6b6773',
					muted: '#9490a0'
				},
				bg: {
					DEFAULT: '#faf9fb',
					alt: '#f3f1f5',
					warm: '#f8f6f4'
				},
				border: {
					DEFAULT: '#e8e5ed',
					light: '#f0eef3'
				},
				success: '#4FB161',
				error: '#c75a5a',
				warning: '#d5a935',
				info: '#70BABE'
			},
			fontFamily: {
				sans: ['Source Sans 3', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
				serif: ['Lora', 'Georgia', 'serif']
			}
		}
	},
	plugins: []
};

