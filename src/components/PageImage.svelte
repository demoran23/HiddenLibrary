<script lang="ts">
    import {slide, fade, fly, blur} from 'svelte/transition';
    import {quintOut, bounceInOut, quintInOut} from 'svelte/easing';

    export let onClick: (e: Event) => Promise<void> | void = () => undefined;
    export let contents: string = undefined;
</script>

{#key contents}
    <div transition:fade="{{ easing: quintInOut}}"
         style="display: flex; flex: 1; width: 100%;justify-content: stretch;flex-direction: row;">
        <img on:click={onClick} src="data:image/png;base64, {contents}"/>
    </div>
{/key}

<style>
    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
</style>