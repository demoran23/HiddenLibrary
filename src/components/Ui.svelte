<script>
  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderGlobalAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderPanelLink,
    Content,
  } from "carbon-components-svelte";
  import {Tab, TabContent, Tabs} from "carbon-components-svelte";
  import Book from './Book.svelte'
  import Browse from "./Browse.svelte";
  import {activeTab, currentBook, library, pages} from "../store";
  import {SettingsAdjust20, UserAvatarFilledAlt20} from "carbon-icons-svelte";

  let isOpen1 = false;
  let isOpen2 = false;

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
    console.log('pages.subscribe', {name, bookTabName});
  });
</script>
<Header company="Hidden Library">
    <HeaderUtilities>
        <HeaderGlobalAction aria-label="Settings"
                            icon={SettingsAdjust20}
                            on:click={console.log}/>
        <HeaderAction
            bind:isOpen={isOpen1}
            closeIcon={UserAvatarFilledAlt20}
            icon={UserAvatarFilledAlt20}
        >
            <HeaderPanelLinks>
                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 3</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction>
        <HeaderAction bind:isOpen={isOpen2}>
            <HeaderPanelLinks>
                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 5</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction>
    </HeaderUtilities>
</Header>

<Content class="container">
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
</Content>
