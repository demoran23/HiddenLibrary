<script lang="ts">
    import Counter from './components/Counter.svelte'
    import {initializeStoreFromLocalStorage} from "./store";
</script>

{#await initializeStoreFromLocalStorage()}
{:then value}
    <div>
        <!--  <img src={logo} alt="Svelte Logo" />-->
        <h1>Hello Typescript!</h1>

        <Counter/>
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}