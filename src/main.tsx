import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './index.css';
import './styles/main.scss';
import ClickSpark from './components/effects/ClickSpark.tsx';
// import { DropDownMenu } from './components/DropDownMenu.tsx';

function AppShell() {
  const { theme } = useTheme();

  return (
    <ClickSpark
      sparkColor={theme === 'dark' ? '#fff' : '#000'}
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      {/* <DropDownMenu /> */}
      <App />
    </ClickSpark>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
