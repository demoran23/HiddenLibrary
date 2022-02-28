<script lang="ts">
    import {
        sendGetPageRequest,
    } from '../api/tauri';
    import {pages, currentBook, setCurrentPage} from "../store";
    import type {GetPageRequest} from "../types";
    import {debounce, difference, keys, range} from 'lodash-es';
    import PageImage from "./PageImage.svelte";
    import Button, {Label, Icon} from '@smui/button';
    import Select, {Option} from '@smui/select';
    import Slider from '@smui/slider';
    import FormField from '@smui/form-field';

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
        console.log({minIndex, maxIndex, existingPages, pageIndexesToRequest});
        for (const index of pageIndexesToRequest) {
            const req: GetPageRequest = {page: index, path: $currentBook.path};
            sendGetPageRequest(req);
        }

        const el = document.getElementById("page_specifier") as HTMLInputElement;
        if (el)
            el.value = String($currentBook.currentPage);
    }

    const nextPage = () => {
        const nextPageIndex = Math.min($currentBook.currentPage + 1, $currentBook.length - 1);
        if (!$pages[nextPageIndex])
            sendGetPageRequest({page: nextPageIndex, path: $pages.bookPath});
        setCurrentPage(nextPageIndex);
    }
</script>

<div>
    {#if $currentBook?.path}
        <FormField align="end" style="display: flex;">
            <Button disabled={$currentBook.currentPage <= 0}
                    on:click={() => {setCurrentPage($currentBook.currentPage - 1);}}>
                <Label>Previous</Label>
            </Button>
            <Label>{$currentBook.currentPage} / {($currentBook.length - 1)}</Label>
            <Slider max={($currentBook.length - 1)} style="flex-grow: 1;" bind:value={selectedIndex} on:SMUISlider:change={onSliderChange}/>
            <Select bind:value={selectedIndex} label="Jump To" on:SMUISelect:change={onSliderChange}>
                {#each pageList as index}
                    <Option value={index}>{index}</Option>
                {/each}
            </Select>
            <Button disabled={$currentBook.currentPage >= ($currentBook.length ?? 0) - 1}
                    on:click={() => {setCurrentPage($currentBook.currentPage + 1)}}>
                <Label>Next</Label>
            </Button>
        </FormField>
    {/if}
    <PageImage contents={$pages[$currentBook?.currentPage]?.img ?? ''} onClick={nextPage}/>
</div>
