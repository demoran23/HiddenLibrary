<script lang="ts">
  import logo from './assets/svelte.png'
  import Counter from './components/Counter.svelte'

  const f7params = {
    // App Name
    name: 'Hidden Library',
    // App id
    id: 'hiddenlibrary',
    // ...
  };
</script>

<div >
<!--  <img src={logo} alt="Svelte Logo" />-->
  <h1>Hello Typescript!</h1>

  <Counter />
</div>
