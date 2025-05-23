export const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Green base
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399', // Minty fresh
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  accent: {
    100: '#fff7ed',
    200: '#ffedd5',
    300: '#fed7aa',  // Soft orange/ochre
    400: '#fdba74',
    500: '#fb923c',
  },
  sky: {
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Light sky
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  }
}
export const typography = {
  fontFamily: {
    sans: ['"Poppins"', 'system-ui', 'sans-serif'],
    cute: ['"Comic Neue"', '"Baloo 2"', 'cursive'], // Optional playful style
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    md: '1.05rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '1.875rem',
    '3xl': '2.25rem',
    '4xl': '3rem',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
}
export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
  md: '0 4px 8px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 20px rgba(0, 0, 0, 0.08)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  glow: '0 0 15px rgba(34, 197, 94, 0.3)', // green glow
};
export const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};
export const transitions = {
  duration: {
    short: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    springy: 'cubic-bezier(0.2, 1, 0.22, 1)',
  },
};
