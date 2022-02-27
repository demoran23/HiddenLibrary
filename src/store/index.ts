import {get, writable, derived} from 'svelte/store';
import type {Writable, Unsubscriber, Readable} from 'svelte/store';
import {setItem, getItem} from 'localforage'
import type {Library, Pages, Book} from "../types";
import {WindowManager} from "@tauri-apps/api/window";
import {listen} from "@tauri-apps/api/event";
import type {GetPageResponse, Page} from "../types";

const currentBookDefault: Book = {currentPage: 0} as Book;
const pagesDefault: Pages = {bookPath: undefined};
const libraryDefault = {};

export let pages: Writable<Pages> = writable<Pages>(pagesDefault)
export let library: Writable<Library> = writable<Library>(libraryDefault);
export let currentBook: Readable<Book> = getCurrentBook();

function getCurrentBook() {
    return derived([library, pages], ([l, p]) => {
        const book = l[p.bookPath];
        return book ?? currentBookDefault;
    });
}

export function setCurrentPage(index: number) {
    const p = get(pages);
    library.update(existing => {
        const book = existing[p.bookPath];

        // Protect against going out of bounds
        if (index >= 0 || index < book.length - 1)
            book.currentPage = index;

        return existing;
    })
}

export let unsubscribers: Unsubscriber[] = [];

export const initializeStoreFromLocalStorage = async () => {
    try {
        await getItem<Library>('library').then(value => {
            library = writable(value ?? {} as Library);
            const u = library.subscribe(async (value) => {
                await setItem('library', value)
            })
            unsubscribers.push(u);
        });
        await getItem<Pages>('pages').then(value => {
            pages = writable(value ?? pagesDefault);
            const u = pages.subscribe(async (value) => {
                await setItem('pages', value)
            })
            unsubscribers.push(u);
        });

        // const wm = new WindowManager("main");
        // const res = await wm.setTitle(value.name ?? "Hidden Library");

        await listen<GetPageResponse>('get-page-response', e => {
            const page: Page = {img: e.payload.contents, req: e.payload.request};
            pages.update(value => ({...value, [page.req.page]: page, bookPath: page.req.path}));
        });

        currentBook = getCurrentBook();
    } catch (e) {
        console.error(e);
        throw e;
    }
}