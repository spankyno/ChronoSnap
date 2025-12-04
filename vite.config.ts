import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // This is necessary because the prompt guidelines require using process.env.API_KEY directly
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});