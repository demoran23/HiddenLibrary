<script lang="ts">
    import {slide, fade, fly, blur} from 'svelte/transition';
    import {quintOut, bounceInOut, quintInOut} from 'svelte/easing';

    export let onClick: (e: Event) => Promise<void> | void = () => undefined;
    export let contents: string = undefined;
</script>

{#key contents}
    {#if contents}
        <div class="flex-container" transition:fade="{{ easing: quintInOut}}">
            <img on:click={onClick} src="data:image/png;base64, {contents}"/>
        </div>
    {/if}
{/key}

<style>
    .flex-container {
        display: flex;
        flex: 1;
    }

    .flex-container > img {
        display: flex;
        flex: 1;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

</style>