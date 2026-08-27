// @ts-check
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

const src = fileURLToPath(new URL('./src', import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },

  vite: {
    resolve: {
      alias: {
        '@': src,
        '@components': `${src}/components`,
        '@data': `${src}/data`,
        '@lib': `${src}/lib`,
        '@layouts': `${src}/layouts`,
        '@styles': `${src}/styles`,
      },
    },
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