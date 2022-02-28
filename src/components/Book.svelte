<script lang="ts">
    import {
        sendGetPageRequest,
        setCurrentZip
    } from '../api/tauri';
    import {library, pages, currentBook, setCurrentPage} from "../store";
    import type {GetPageRequest} from "../types";
    import {difference, keys, range} from 'lodash-es';
    import PageImage from "./PageImage.svelte";
    import {open} from '@tauri-apps/api/dialog'
    import Button, { Label, Icon } from '@smui/button';
    import Select, { Option } from '@smui/select';

    const pageList =  range(0, $currentBook.length - 1);

    $: $currentBook?.currentPage, onCurrentPageChange()

    function onCurrentPageChange() {
        if (!$currentBook?.path)
            return;

        const pagePrefetchRadius = 1;
        const minIndex = Math.max($currentBook.currentPage - pagePrefetchRadius, 0);
        const maxIndex = Math.min($currentBook.currentPage + pagePrefetchRadius, $currentBook.length - 1);
        const existingPages = keys($pages).map(Number).filter(isFinite);
        const pageIndexesToRequest = difference<number>(range(minIndex, maxIndex), existingPages);
        // console.log({minIndex, maxIndex, existingPages, pageIndexesToRequest});
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

    function onChangePageNumber(e: Event) {
        const target = e.target as HTMLInputElement;
        const value = target.valueAsNumber;
        const upperBound = ($currentBook.length ?? 0) - 1;

        if (value >= upperBound) {
            e.preventDefault();
            setCurrentPage(upperBound);
            target.value = String($currentBook.currentPage);
        } else if (value <= 0) {
            e.preventDefault();
            setCurrentPage(0);
            target.value = String($currentBook.currentPage);
        } else {
            setCurrentPage(value);
        }
    }

    async function openFileDialog() {
        try {
            const path = await open({title: "Select a zip file", filters: [{name: "zip", extensions: ["zip"]}]}) as string;

            // If this is the book we're already reading, get out of here
            // If there's no path, get out of here
            if (!path || $pages.bookPath === path) {
                console.log("The path is either missing, or the same as the existing book", path);
                return;
            }

            // Clear the pages, since we're reading a new book
            pages.set({bookPath: path});

            // If it's already in the library, leave it alone and fetch the last page we were on
            if ($library[path]) {
                console.log(`${path} exists in the library already, using it and getting the current page`);

                // Get the latest page we were reading
                const page = $currentBook.currentPage;
                console.log("Getting page", page);
                await sendGetPageRequest({page: page, path});
            }
            // If it isn't in the library, go get it and start from the beginning
            else {
                console.log("This book isn't in the library yet.  Getting it.")
                const book = await setCurrentZip(path);
                library.update(existing => ({...existing, [path]: book}));
                setCurrentPage(0);
                await sendGetPageRequest({page: 0, path});
            }
        } catch (e) {
            throw e;
        }
    }

    function onSelectPage(e: Event) {

    }
</script>
<div>
    <Button on:click={openFileDialog}>
<!--        <Icon class="material-icons">favorite</Icon>-->
        <Label>Open</Label>
    </Button>
    {#if $currentBook?.path}
        <Select on:select={onSelectPage} label="Jump To">
            {#each pageList as index}
                <Option value={index}>{index}</Option>
            {/each}
        </Select>
        <input id="page_specifier" type="number" on:change={onChangePageNumber}/>
        <button disabled={$currentBook.currentPage <= 0}
                on:click={() => {setCurrentPage($currentBook.currentPage - 1);}}>
            Previous
        </button>
        <button disabled={$currentBook.currentPage >= ($currentBook.length ?? 0) - 1}
                on:click={() => {setCurrentPage($currentBook.currentPage + 1)}}>Next
        </button>
        <span>{$currentBook.currentPage}</span>
    {/if}
    <PageImage contents={$pages[$currentBook?.currentPage]?.img ?? ''} onClick={nextPage}/>
    `
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
