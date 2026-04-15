import { useSettings } from "../context/SettingsContext";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/index";
import { motion } from "framer-motion";


function SettingsPage() {
  const {
    fontScale,
    setFontScale,
    soundEnabled,
    setSoundEnabled,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    instructionDisplayMode,
    setInstructionDisplayMode,
  } = useSettings();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 flex flex-col">

      <Header />

      <div className="flex flex-1 items-center justify-center p-6">

        <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
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

          <div className="mb-6 flex items-center justify-between">
            <label className="font-medium">
            Enable Sound Effects
            </label>

            <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 accent-accent-primary"
            />
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <label htmlFor="instruction-display-mode" className="font-medium">
              Exercise Instructions Format
            </label>

            <select
              id="instruction-display-mode"
              value={instructionDisplayMode}
              onChange={(e) => setInstructionDisplayMode(e.target.value as "video" | "text")}
              className="rounded-lg border border-neutral-600 bg-bg-primary px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="video">Video</option>
              <option value="text">Step-by-step text</option>
            </select>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <label className="font-medium">
            Reduced Animations
            </label>

            <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-5 h-5 accent-accent-primary"
            />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <label className="font-medium">
                High Contrast Mode
            </label>

            <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-5 h-5 accent-accent-primary"
            />
        </div>

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
