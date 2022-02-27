<script lang="ts">
    import {
        sendGetPageRequest,
        setCurrentZip
    } from '../api/tauri';
    import {library, pages, currentBook} from "../store";
    import type {GetPageRequest} from "../types";
    import {difference, keys, range} from 'lodash-es';
    import PageImage from "./PageImage.svelte";

    let currentPageIndex: number = 0;
    $: currentPageIndex, onCurrentPageIndexChange()

    function onCurrentPageIndexChange() {
        if (!$currentBook?.path)
            return;

        const pagePrefetchRadius = 1;
        const minIndex = Math.max(currentPageIndex - pagePrefetchRadius, 0);
        const maxIndex = Math.min(currentPageIndex + pagePrefetchRadius, $currentBook.length - 1);
        const existingPages = keys($pages).map(Number).filter(isFinite);
        const pageIndexesToRequest = difference<number>(range(minIndex, maxIndex), existingPages);
        console.log({minIndex, maxIndex, existingPages, pageIndexesToRequest});
        for (const index of pageIndexesToRequest) {
            const req: GetPageRequest = {page: index, path: $currentBook.path};
            sendGetPageRequest(req);
        }

        const el = document.getElementById("page_specifier") as HTMLInputElement;
        if (el)
            el.value = String(currentPageIndex);
    }

    const nextPage = () => {
        const elementById = document.getElementById("file_path") as HTMLInputElement;
        const nextPageIndex = currentPageIndex + 1;
        if (!$pages[nextPageIndex])
            sendGetPageRequest({page: nextPageIndex, path: elementById.value});
        currentPageIndex = nextPageIndex;
    }

    const zipHandler = async () => {
        try {
            const elementById = document.getElementById("file_path") as HTMLInputElement;
            const path = elementById.value?.trim();
            if ($library && $library[path]) {
                currentBook.set($library[path]);
                await sendGetPageRequest({page: 0, path});
            } else if (path && $currentBook?.path !== path) {
                currentBook.set(await setCurrentZip(path));
                currentPageIndex = 0;
                await sendGetPageRequest({page: 0, path});
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
        <button disabled={currentPageIndex <= 0} on:click={() => {currentPageIndex = currentPageIndex - 1;}}>
            Previous
        </button>
        <button disabled={currentPageIndex >= ($currentBook.length ?? 0) - 1}
                on:click={() => {currentPageIndex = currentPageIndex + 1;}}>Next
        </button>
        <span>{currentPageIndex}</span>
    {/if}
    <PageImage contents={$pages[currentPageIndex]?.img} onClick={nextPage} />
`</div>
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
