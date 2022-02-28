<script lang="ts">
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";
  import Book from './components/Book.svelte'
  import Browse from "./components/Browse.svelte";
  import OpenButton from "./components/OpenButton.svelte";
  import { activeTab, currentBook, library, pages } from "./store";

  const tabs = ['Browse', 'View'];
  let bookTabName = "View";

  let active = $currentBook.name ? 1 : 0; // If we have a current book, default to the book, otherwise to the list
  activeTab.subscribe(value => {
    active = tabs.indexOf(value);
  });
  $: activeTab.set(tabs[active]);

  pages.subscribe(value => {
    const name = $library[value.bookPath]?.name;
    bookTabName = name ?? "View";
    console.log('pages.subscribe', { name, bookTabName });
  });

</script>

<div>
    <OpenButton/>
    <Tabs autoWidth
          bind:selected={active}>
        <Tab label="Browse"/>
        <Tab label={bookTabName}/>
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
