<script lang="ts">
    import Book from './components/Book.svelte'
    import {activeTab, initializeStoreFromLocalStorage} from "./store";
    import OpenButton from "./components/OpenButton.svelte";
    import Browse from "./components/Browse.svelte";
    import {Tabs, Tab, TabContent} from "carbon-components-svelte";
    import "carbon-components-svelte/css/white.css";

    const tabs = ['Browse', 'View'];
    let active = 1;
    activeTab.subscribe(value => {
        active = tabs.indexOf(value);
    });
    $: active, activeTab.set(tabs[active]);
</script>

{#await initializeStoreFromLocalStorage()}
{:then value}
    <div>
        <OpenButton/>
        <Tabs bind:selected={active}>
            <Tab label="Browse" />
            <Tab label="View" />
            <svelte:fragment slot="content">
                <TabContent>
                    <Browse/>
                </TabContent>
                <TabContent>
                    <Book/>
                </TabContent>
            </svelte:fragment>
        </Tabs>
    </div>
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}