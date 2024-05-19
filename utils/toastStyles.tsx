import colors from './colors';

const toastStyles = {
	success: {
		style: {
			background: colors.neutral[50],
			color: colors.neutral[600],
			borderRadius: '4px',
			fontSize: '0.8rem',
		},
		iconTheme: {
			primary: colors.neutral[100],
			secondary: colors.neutral[600],
		},
	},
};

export default toastStyles;
