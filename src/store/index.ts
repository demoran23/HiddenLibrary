import {writable} from 'svelte/store';
import type {Library, Pages, ZipInfo} from "../types";

export const currentZip = writable<ZipInfo>({} as any);
export const pages = writable<Pages>({})
export const library = writable<Library>({});
