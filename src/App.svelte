<script lang="ts">
  import logo from './assets/svelte.png'
  import Counter from './lib/Counter.svelte'
  import { App, View, Page, Navbar, Toolbar, Link } from 'framework7-svelte';
  import HiddenLibraryAppbar from './lib/HiddenLibraryAppbar.svelte';

  const f7params = {
    // App Name
    name: 'Hidden Library',
    // App id
    id: 'hiddenlibrary',
    // ...
  };
</script>

<App >
  <HiddenLibraryAppbar />
  <img src={logo} alt="Svelte Logo" />
  <h1>Hello Typescript!</h1>

  <Counter />
</App>
