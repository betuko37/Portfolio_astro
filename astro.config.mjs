// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'three',
        'ogl',
        'motion/react',
        'gsap',
        'gsap/ScrollTrigger',
      ],
    },
  },

  adapter: vercel()
});