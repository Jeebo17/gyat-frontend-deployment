import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useSound from 'use-sound';
import { 
  Map, 
  HomePage, 
  NotFoundPage, 
  SettingsPage, 
  LoginPage,
  SignUpPage
} from './pages';
import startSound from './assets/sounds/start.mp3';

function App() {
  const [play] = useSound(startSound, { volume: 0.5 });

  useEffect(() => {
    play();
  }, [play]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<Map />} />
      <Route path="/settings" element={<SettingsPage />}/> 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
