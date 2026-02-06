import { Routes, Route } from "react-router-dom";
import { Map, HomePage, NotFoundPage, SettingsPage } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<Map />} />
      <Route path="/settings" element={<SettingsPage />}/> 
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
