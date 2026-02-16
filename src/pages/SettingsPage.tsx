import { useSettings } from "../context/SettingsContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { motion } from "framer-motion";

function SettingsPage() {
  const { fontScale, setFontScale } = useSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 flex flex-col">

      <Header />

      <div className="flex flex-1 items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl p-8 bg-bg-secondary/50 backdrop-blur-lg rounded-2xl border-2 border-neutral-700/30"
        >

          <h1 className="text-3xl font-semibold mb-6">
            Accessibility Settings
          </h1>

          {/* Font Size Slider */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Font Size: {Math.round(fontScale * 100)}%
            </label>

            <input
              type="range"
              min="0.85"
              max="1.4"
              step="0.05"
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              className="w-full accent-accent-primary"
            />
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-accent-primary text-white rounded-xl hover:bg-accent-hover transition-colors duration-200 shadow-md"
          >
            Back
          </button>

        </motion.div>

      </div>
    </div>
  );
}

export default SettingsPage;
