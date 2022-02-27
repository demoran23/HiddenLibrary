import {writable} from 'svelte/store';
import type {Writable, Unsubscriber} from 'svelte/store';
import {setItem, getItem} from 'localforage'
import type {Library, Pages, ZipInfo} from "../types";

export let currentZip: Writable<ZipInfo> = writable<ZipInfo>({} as ZipInfo);
export let pages: Writable<Pages> = writable<Pages>({})
export let library: Writable<Library> = writable<Library>({});
export let unsubscribers: Unsubscriber[] = [];

currentZip.subscribe(value => {
});
export const initializeStoreFromLocalStorage = async () => {
    try {
        await getItem<Library>('library').then(value => {
            library = writable(value ?? {} as Library);
            return library.subscribe(async (value) => {
                await setItem('library', value)
            })
        });
        await getItem<ZipInfo>('currentZip').then(value => {
            currentZip = writable(value ?? {} as ZipInfo)
            return currentZip.subscribe(async (value) => {
                await setItem('currentZip', value);
                if (value.path)
                    library.update(existing => ({...existing, [value.path]: value}));
            })
        });
        await getItem<Pages>('pages').then(value => {
            pages = writable(value ?? {});
            return pages.subscribe(async (value) => {
                await setItem('pages', value)
            })
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
}