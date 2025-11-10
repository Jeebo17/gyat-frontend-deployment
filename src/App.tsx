import { ThemeToggle } from './components/ThemeToggle';
import './styles/App.scss';

function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center bg-bg-secondary p-8 rounded-2xl">
          <h1 className="text-5xl font-bold mb-4">hello ladies and gentlemen</h1>
          <p className="text-xl text-text-secondary mb-8">basic framework react webapp with light and dark mode :)</p>
          <div className="flex gap-4 justify-center">
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                nathan
              </button>

              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                shiying
              </button>

              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                sophie
              </button>

              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                amy
              </button>

              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                karim
              </button>

              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                seb
              </button>

              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                ahmed
              </button>

              <button className="px-6 py-6 rounded-lg border border-border-medium text-text-primary bg-bg-tertiary transition duration-200 font-medium shadow-l hover:-translate-y-1">
                daniel
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
