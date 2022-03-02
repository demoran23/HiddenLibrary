import sveltePreprocess from 'svelte-preprocess'
import tsconfigPaths from 'vite-tsconfig-paths'
import {dirname} from 'path';

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [sveltePreprocess({
    // NOTE: scss seems to delay app startup when debugging quite a bit
    // scss: {
    //   includePaths: [
    //     dirname('../../node_modules/'),
    //     'node_modules/',
    //     'src/',
    //   ]
    // }
  })],

  plugins: [tsconfigPaths()],
}
