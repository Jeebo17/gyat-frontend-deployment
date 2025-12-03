import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import './styles/main.scss';
import ClickSpark from './components/effects/ClickSpark.tsx';
import { ThemeToggle } from './components/ThemeToggle.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ClickSpark
          sparkColor='#fff'
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <ThemeToggle />
          <App />
        </ClickSpark>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
