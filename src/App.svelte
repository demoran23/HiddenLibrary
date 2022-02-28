<script lang="ts">
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import Book from './components/Book.svelte'
  import Browse from "./components/Browse.svelte";
  import OpenButton from "./components/OpenButton.svelte";
  import { activeTab, currentBook, initializeStoreFromLocalStorage } from "./store";

  const tabs = ['Browse', 'View'];
  let active = $currentBook.name ? 1 : 0; // If we have a current book, default to the book, otherwise to the list
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
            <Tab label="Browse"/>
            <Tab label={$currentBook.name ?? "View"}/>
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
