<script lang="ts">
    import {
        setCurrentZip
    } from '../api/tauri';
    import {library, pages, currentBook} from "../store";
    import {emit, listen} from '@tauri-apps/api/event'
    import type {GetPageRequest, GetPageResponse, Page} from "../types";
    import {difference, isNumber, keys, range} from 'lodash-es';
    import {slide} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';

    listen<GetPageResponse>('get-page-response', e => {
        const page: Page = {img: e.payload.contents, req: e.payload.request};
        pages.update(value => ({...value, [page.req.page]: page}));
    });

    let currentPageIndex: number = 0;
    $: currentPageIndex, onCurrentPageIndexChange()

    function onCurrentPageIndexChange() {
        if (!$currentBook?.path)
            return;

        const pagePrefetchRadius = 3;
        const minIndex = Math.max(currentPageIndex - pagePrefetchRadius, 0);
        const maxIndex = Math.min(currentPageIndex + pagePrefetchRadius, $currentBook.length);
        const existingPages = keys($pages).map(Number).filter(isNumber);
        const pageIndexesToRequest = difference<number>(range(minIndex, maxIndex), existingPages);
        console.log({minIndex, maxIndex, existingPages, pageIndexesToRequest});
        for (const index of pageIndexesToRequest) {
            const req: GetPageRequest = {page: index, path: $currentBook.path};
            emit('get-page-request', req);
        }

        const el = document.getElementById("page_specifier") as HTMLInputElement;
        if (el)
            el.value = String(currentPageIndex);
    }

    const nextPage = () => {
        const elementById = document.getElementById("file_path") as HTMLInputElement;
        const nextPageIndex = currentPageIndex + 1;
        if (!$pages[nextPageIndex])
            emit('get-page-request', {page: nextPageIndex, path: elementById.value});
        currentPageIndex = nextPageIndex;
    }

    const zipHandler = async () => {
        try {
            const elementById = document.getElementById("file_path") as HTMLInputElement;
            const path = elementById.value;
            if ($library && $library[path]) {
                currentBook.set($library[path]);
                await emit('get-page-request', {page: 0, path: elementById.value});
            } else if (path && $currentBook?.path !== path) {
                currentBook.set(await setCurrentZip(path));
                currentPageIndex = 0;
                await emit('get-page-request', {page: 0, path: elementById.value});
            } else {
                throw Error("Something went wrong")
            }
        } catch (e) {
            console.error('zipHandler', e);
            throw e;
        }
    }

    function onChangePageNumber(e: Event) {
        console.log(e);
        const target = e.target as HTMLInputElement;
        const value = target.valueAsNumber;
        const upperBound = ($currentBook.length ?? 0) - 1;

        if (value > upperBound) {
            e.preventDefault();
            currentPageIndex = upperBound;
            target.value = String(currentPageIndex);
        } else if (value <= 0) {
            e.preventDefault();
            currentPageIndex = 0;
            target.value = String(currentPageIndex);
        } else {
            currentPageIndex = value;
        }
    }
</script>
<div>
    <input id="file_path" value="{$currentBook.path}"/>
    <button on:click={zipHandler}>Open</button>
    {#if $currentBook.path}
        <input id="page_specifier" type="number" on:change={onChangePageNumber}/>
        <button disabled="{currentPageIndex <= 0}" on:click={() => {currentPageIndex = currentPageIndex - 1;}}>
            Previous
        </button>
        <button disabled="{currentPageIndex >= ($currentBook.length ?? 0) - 1}"
                on:click={() => {currentPageIndex = currentPageIndex + 1;}}>Next
        </button>
        <span>{currentPageIndex}</span>
    {/if}
    {#if $pages[currentPageIndex]}
        <div transition:slide="{{delay: 250, duration: 300, easing: quintOut }}"
             style="display: flex; flex: 1; width: 100%;justify-content: stretch;flex-direction: row;">
            <img on:click={nextPage} src="data:image/png;base64, {$pages[currentPageIndex].img}"/>
        </div>
    {/if}
</div>
<style>
    button {
        font-family: inherit;
        font-size: inherit;
        padding: 1em 2em;
        color: #ff3e00;
        background-color: rgba(255, 62, 0, 0.1);
        border-radius: 2em;
        border: 2px solid rgba(255, 62, 0, 0);
        outline: none;
        width: 200px;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
    }

    button:focus {
        border: 2px solid #ff3e00;
    }

    button:active {
        background-color: rgba(255, 62, 0, 0.2);
    }

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
</style>
