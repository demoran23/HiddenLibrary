<script lang="ts">
    import Book from './components/Book.svelte'
    import {initializeStoreFromLocalStorage} from "./store";
</script>

{#await initializeStoreFromLocalStorage()}
{:then value}
    <div>
        <h1>Hello Typescript!</h1>
        <Book/>
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}