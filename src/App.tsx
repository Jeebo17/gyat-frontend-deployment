import { Routes, Route } from "react-router-dom";
import { 
  Map, 
  HomePage, 
  NotFoundPage, 
  SettingsPage, 
  LoginPage,
  SignUpPage
} from './pages';

function App() {
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
