import sveltePreprocess from 'svelte-preprocess'
import tsconfigPaths from 'vite-tsconfig-paths'
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess(),
  plugins: [tsconfigPaths()],
}
