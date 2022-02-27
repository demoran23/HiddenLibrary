import {get, writable} from 'svelte/store';
import type {Writable, Unsubscriber} from 'svelte/store';
import {setItem, getItem} from 'localforage'
import type {Library, Pages, Book} from "../types";
import {WindowManager} from "@tauri-apps/api/window";


const currentBookDefault = {} as Book;
export let currentBook: Writable<Book> = writable<Book>(currentBookDefault);

const pagesDefault = { book: currentBookDefault};
export let pages: Writable<Pages> = writable<Pages>(pagesDefault)

const libraryDefault = {};
export let library: Writable<Library> = writable<Library>(libraryDefault);

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
        await getItem<Book>('currentBook').then(value => {
            currentBook = writable(value ?? currentBookDefault)
            const u = currentBook.subscribe(async (value) => {
                await setItem('currentBook', value);

                // When our current zip changes, update our library for that zip
                if (value.path)
                {
                    library.update(existing => ({...existing, [value.path]: value}));

                    // If we've changed books, clear out our pages
                    if (get(pages).book.path !== value.path) {
                        console.log('currentBook', "Reinitializing")
                        pages.set({ book: value });
                    }
                }
                const wm = new WindowManager("Hidden Library");
                const res = await wm.setTitle(value.name ?? "Hidden Library");
                console.log('currentBook', { value, res})
            })
            unsubscribers.push(u);
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
}