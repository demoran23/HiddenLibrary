<script lang="ts">
    import Book from './components/Book.svelte'
    import {activeTab, initializeStoreFromLocalStorage} from "./store";
    import OpenButton from "./components/OpenButton.svelte";
    import Tab, {Label} from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from '@smui/button';
    import Browse from "./components/Browse.svelte";

    let active = 'View';
    activeTab.subscribe(value => {
        active = value;
    });
    $: active, activeTab.set(active);
</script>

{#await initializeStoreFromLocalStorage()}
{:then value}
    <div>
        <OpenButton/>
        <TabBar tabs={['Browse', 'View']} let:tab bind:active>
            <Tab {tab}>
                <Label>{tab}</Label>
            </Tab>
        </TabBar>
        {#if active === 'View'}
            <Book/>
        {:else if active === 'Browse'}
            <Browse/>
        {/if}
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}