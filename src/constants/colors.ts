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
};

export type Theme = 'light' | 'dark';
export type ColorCategory = keyof typeof colors.light;
