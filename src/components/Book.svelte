<script lang="ts">
  import { Button, Slider } from 'carbon-components-svelte';
  import { debounce, difference, keys, range } from 'lodash-es';
  import { sendGetPageRequest, } from '../api/tauri';
  import { currentBook, pages, setCurrentPage } from "../store";
  import type { GetPageRequest } from "../types";
  import PageImage from "./PageImage.svelte";

  let selectedIndex: number = $currentBook.currentPage ?? 0;
  $: $currentBook?.currentPage, onCurrentPageChange()

  const onSliderChange = debounce((e: { detail: number | null }) => {
    if (!isFinite(e.detail)) return;
    if (e.detail == null) return;
    console.log(e);
    setCurrentPage(e.detail);
    onCurrentPageChange();
  }, 100);

  function onCurrentPageChange() {
    if (!$currentBook?.path)
      return;

    selectedIndex = $currentBook.currentPage;
    const pagePrefetchRadius = 1;
    const minIndex = Math.max($currentBook.currentPage - pagePrefetchRadius, 0);
    const maxIndex = Math.min($currentBook.currentPage + pagePrefetchRadius, $currentBook.length - 1);
    const existingPages = keys($pages).map(Number).filter(isFinite);
    const pageIndexesToRequest = difference<number>(range(minIndex, maxIndex), existingPages);
    // console.log({ minIndex, maxIndex, existingPages, pageIndexesToRequest });
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
        <div style="display: flex; flex-direction: row; justify-content: space-between">
            <Button disabled={$currentBook.currentPage <= 0}
                    on:click={() => {setCurrentPage($currentBook.currentPage - 1);}}>
                Previous
            </Button>
            <Slider max={($currentBook.length - 1)}
                    value={selectedIndex}
                    on:change={onSliderChange}/>
            <Button disabled={$currentBook.currentPage >= ($currentBook.length ?? 0) - 1}
                    on:click={() => {setCurrentPage($currentBook.currentPage + 1)}}>
                <span>Next</span>
            </Button>
        </div>
    {/if}
    <PageImage contents={$pages[$currentBook?.currentPage - 1] ?? ''}
               onClick={nextPage}/>
</div>

<style>
    .bx--slider-container, .bx--slider {
        width: 100%;
        flex: 1;
        display: flex;
    }
</style>
