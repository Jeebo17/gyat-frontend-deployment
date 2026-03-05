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
  EditMapPage,
  SearchMapPage
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/map/edit" element={<EditMapPage />} />
      <Route path="/map/search" element={<SearchMapPage />} />
      <Route path="/map/:id" element={<Map />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
