import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), glsl()],
	server: {
		host: '127.0.0.1',
		port: 5179
	}
});
