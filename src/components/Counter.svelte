<script lang="ts">
    import {
        setCurrentZip
    } from '../api/tauri';
    import {library, pages, currentZip} from "../store";
    import {emit, listen} from '@tauri-apps/api/event'
    import type {GetPageResponse, Page} from "../types";


    listen<GetPageResponse>('get-page-response', e => {
        const page: Page = {img: e.payload.contents, req: e.payload.request};
        pages.update(value => ({...value, [page.req.page]: page}));
    });

    let currentPageIndex: number = 0;
    $: currentPageIndex, onCurrentPageIndexChange()

    function onCurrentPageIndexChange() {
        if (!$currentZip?.path)
            return;

        if (!$pages[currentPageIndex])
            emit('get-page-request', {page: currentPageIndex, path: $currentZip.path});

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
                currentZip.set($library[path]);
                await emit('get-page-request', {page: 0, path: elementById.value});
            } else if (path && $currentZip?.path !== path) {
                currentZip.set(await setCurrentZip(path));
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
        const upperBound = ($currentZip.length ?? 0) - 1;

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
    <input id="file_path" value="H:\fakku\chapters\[Homunculus] Courting Étranger (COMIC Kairakuten 2017-02).zip"/>
    <button on:click={zipHandler}>Open</button>
    {#if $currentZip.path}
        <input id="page_specifier" type="number" on:change={onChangePageNumber}/>
        <button disabled="{currentPageIndex <= 0}" on:click={() => {currentPageIndex = currentPageIndex - 1;}}>
            Previous
        </button>
        <button disabled="{currentPageIndex >= ($currentZip.length ?? 0) - 1}"
                on:click={() => {currentPageIndex = currentPageIndex + 1;}}>Next
        </button>
        <span>{currentPageIndex}</span>
    {/if}
    {#if $pages[currentPageIndex]}
        <div style="display: flex; flex: 1; width: 100%;justify-content: stretch;flex-direction: row;">
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
