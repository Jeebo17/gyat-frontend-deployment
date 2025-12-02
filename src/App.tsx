import { Routes, Route } from "react-router-dom";
import Map from "./pages/Map";
import Home from "./pages/Home";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
