import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { seoPlugin } from './plugins/seo.js';

export default defineConfig({
  plugins: [tailwindcss(), seoPlugin()],
});
