export interface ITypography {
    fonts: {
        heading: string;
        body: string;
        mono: string;
    };
    fontSizes: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
    };
    fontWeights: {
        light: number;
        normal: number;
        bold: number;
    };
}
/**
 * Design System Implementation.
 * Only these values should be used in the application.
 */
export default {
    fonts: {
        heading: '"Inter", sans-serif',
        body: 'system-ui, sans-serif',
        mono: 'Menlo, monospace'
    },
    fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem'
    },
    fontWeights: {
        light: 300,
        normal: 400,
        bold: 600
    }
};
