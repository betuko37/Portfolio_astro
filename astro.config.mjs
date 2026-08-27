// @ts-check
import { fileURLToPath } from 'node:url';

import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

const src = fileURLToPath(new URL('./src', import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },

  env: {
    schema: {
      GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      GITHUB_LOGIN: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

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