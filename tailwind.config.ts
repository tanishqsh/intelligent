import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			colors: {
				'intelligent-yellow': '#FFAF34',
				'primary-white': '#EDF2F6',
			},
			fontFamily: {
				'general-sans': 'var(--font-generalSans)',
				'space-mono': 'var(--font-spaceMono)',
				inter: 'var(--font-inter)',
			},
		},
	},
	plugins: [],
};
export default config;
