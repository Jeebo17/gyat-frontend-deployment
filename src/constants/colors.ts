export const colors = {
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
      tertiary: '#ebebeb',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      tertiary: '#999999',
    },
    accent: {
      primary: '#0066cc',
      secondary: '#0052a3',
      hover: '#0052a3',
      light: '#e6f0ff',
    },
    border: {
      light: '#e0e0e0',
      medium: '#cccccc',
      dark: '#999999',
    },
    interactive: {
      hover: '#f0f0f0',
      active: '#e0e0e0',
      disabled: '#f5f5f5',
    },
  },
  dark: {
    background: {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
      tertiary: '#3d3d3d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      tertiary: '#808080',
    },
    accent: {
      primary: '#4da6ff',
      secondary: '#66b3ff',
      hover: '#66b3ff',
      light: '#1a3a52',
    },
    border: {
      light: '#404040',
      medium: '#555555',
      dark: '#666666',
    },
    interactive: {
      hover: '#2d2d2d',
      active: '#3d3d3d',
      disabled: '#2d2d2d',
    },
  },
  // High contrast theme for accessibility (WCAG AAA compliant)
  lightHighContrast: {
    background: {
      primary: '#ffffff',
      secondary: '#ffffff',
      tertiary: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
      tertiary: '#000000',
    },
    accent: {
      primary: '#0052cc',
      secondary: '#003399',
      hover: '#003399',
      light: '#cce5ff',
    },
    border: {
      light: '#000000',
      medium: '#000000',
      dark: '#000000',
    },
    interactive: {
      hover: '#e6e6e6',
      active: '#cccccc',
      disabled: '#f5f5f5',
    },
  },
  darkHighContrast: {
    background: {
      primary: '#000000',
      secondary: '#000000',
      tertiary: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
      tertiary: '#ffffff',
    },
    accent: {
      primary: '#00d9ff',
      secondary: '#00b8d4',
      hover: '#00b8d4',
      light: '#00334d',
    },
    border: {
      light: '#ffffff',
      medium: '#ffffff',
      dark: '#ffffff',
    },
    interactive: {
      hover: '#1a1a1a',
      active: '#333333',
      disabled: '#0d0d0d',
    },
  },
};

export type Theme = 'light' | 'dark';
export type ColorCategory = keyof typeof colors.light;
