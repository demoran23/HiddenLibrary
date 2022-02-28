<script lang="ts">
  import { Button, Select, SelectItem, Slider } from 'carbon-components-svelte';
  import { debounce, difference, keys, range } from 'lodash-es';
  import { sendGetPageRequest, } from '../api/tauri';
  import { currentBook, pages, setCurrentPage } from "../store";
  import type { GetPageRequest } from "../types";
  import PageImage from "./PageImage.svelte";

  const pageList = range(0, $currentBook.length - 1);

  let selectedIndex: number = $currentBook.currentPage;
  $: $currentBook?.currentPage, onCurrentPageChange()

  interface SmuiSliderOnChangeEvent {
    detail: {
      value: number;
    }
  }
 
  const onSliderChange = debounce((e: SmuiSliderOnChangeEvent) => {
    console.log(e);
    setCurrentPage(e.detail.value);
    onCurrentPageChange();
  }, 100) as (SmuiSliderOnChangeEvent) => void;

  function onCurrentPageChange() {
    if (!$currentBook?.path)
      return;

    selectedIndex = $currentBook.currentPage;
    const pagePrefetchRadius = 1;
    const minIndex = Math.max($currentBook.currentPage - pagePrefetchRadius, 0);
    const maxIndex = Math.min($currentBook.currentPage + pagePrefetchRadius, $currentBook.length - 1);
    const existingPages = keys($pages).map(Number).filter(isFinite);
    const pageIndexesToRequest = difference<number>(range(minIndex, maxIndex), existingPages);
    console.log({ minIndex, maxIndex, existingPages, pageIndexesToRequest });
    for (const index of pageIndexesToRequest) {
      const req: GetPageRequest = { page: index, path: $currentBook.path };
      void sendGetPageRequest(req);
    }

    const el = document.getElementById("page_specifier") as HTMLInputElement;
    if (el)
      el.value = String($currentBook.currentPage);
  }

  const nextPage = () => {
    const nextPageIndex = Math.min($currentBook.currentPage + 1, $currentBook.length - 1);
    if (!$pages[nextPageIndex])
      void sendGetPageRequest({ page: nextPageIndex, path: $pages.bookPath });
    setCurrentPage(nextPageIndex);
  }
</script>

<div>
    {#if $currentBook?.path}
        <div align="end" style="display: flex;">
            <Button disabled={$currentBook.currentPage <= 0}
                    on:click={() => {setCurrentPage($currentBook.currentPage - 1);}}>
                Previous
            </Button>
            <span>{$currentBook.currentPage} / {($currentBook.length - 1)}</span>
            <Slider max={($currentBook.length - 1)} style="flex-grow: 1;" bind:value={selectedIndex}
                    on:change={onSliderChange}/>
            <Select bind:value={selectedIndex} label="Jump To" on:change={onSliderChange}>
                {#each pageList as index}
                    <SelectItem value={index} text={index}/>
                {/each}
            </Select>
            <Button disabled={$currentBook.currentPage >= ($currentBook.length ?? 0) - 1}
                    on:click={() => {setCurrentPage($currentBook.currentPage + 1)}}>
                <span>Next</span>
            </Button>
        </div>
    {/if}
    <PageImage contents={$pages[$currentBook?.currentPage]?.img ?? ''} onClick={nextPage}/>
</div>
