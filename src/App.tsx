import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { 
  Map, 
  HomePage, 
  NotFoundPage, 
  SettingsPage, 
  LoginPage,
  SignUpPage,
  ProfilePage,
  EditMapPage
} from './pages';
import startSound from './assets/sounds/start.mp3';
import { useAppSound } from './hooks/useAppSound';

function App() {
  const [play] = useAppSound(startSound, { volume: 0.3 });

  useEffect(() => {
    play();
  }, [play]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<Map />} />
      <Route path="/map/edit" element={<EditMapPage />} />
      <Route path="/settings" element={<SettingsPage />}/> 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
