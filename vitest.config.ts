import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setupTests.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/test/**',
                'src/**/__tests__/**',
                'src/vite-env.d.ts',
                'src/main.tsx',
                'src/backgrounds/Silk.tsx',
                'src/components/effects/ClickSpark.tsx',
                'src/components/effects/FuzzyText.tsx',
                'src/types/**',
                'src/pages/index.ts',
                'src/services/index.ts',
            ],
        }
    }
})