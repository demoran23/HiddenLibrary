import { listen } from "@tauri-apps/api/event";
import { getItem, setItem } from 'localforage'
import type { Readable, Unsubscriber, Writable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';
import { sendGetPageRequest, setCurrentZip } from "../api/tauri";
import type { Book, GetPageResponse, Library, Pages } from "../types";

export const unsubscribers: Unsubscriber[] = [];
const currentBookDefault: Book = { currentPage: 0 } as Book;
const pagesDefault: Pages = { bookPath: undefined };

async function persistentWritable<T>(key: string, defaultValue: T) {
  const item = await getItem<T>(key);
  const writer = writable(item ?? defaultValue);
  const u = writer.subscribe((value) => {
    void setItem(key, value)
  })
  unsubscribers.push(u);
  return writer;
}

export const pages = await persistentWritable<Pages>('pages', pagesDefault)
export const library = await persistentWritable<Library>('library', {});
export const currentBook: Readable<Book> = derived([library, pages], ([l, p]) => {
  const book = l[p.bookPath];
  return book ?? currentBookDefault;
});
export const activeTab = writable<string>('View');

await listenForPage(pages);

function listenForPage(p: Writable<Pages>) {
  return listen<GetPageResponse>('get-page-response', e => {
    console.log('get-page-response', e);
    const { request: { page, path }, contents } = e.payload;

    p.update(value => ({ ...value, [page]: contents, bookPath: path }));
  });
}

export function setCurrentPage(index: number) {
  const p = get(pages);
  library.update(existing => {
    const book = existing[p.bookPath];

    // Protect against going out of bounds
    if (index >= 0 || index < book.length - 1) {
      console.log("setting current page", index, typeof index);
      book.currentPage = index;
    }

    return existing;
  })
}

export async function setCurrentBookPath(path: string) {
  // If this is the book we're already reading, get out of here
  // If there's no path, get out of here
  if (!path || get(pages).bookPath === path) {
    console.log("The path is either missing, or the same as the existing book", path);
    return;
  }

  // Clear the pages, since we're reading a new book
  pages.set({ bookPath: path });

  // If it's already in the library, leave it alone and fetch the last page we were on
  if (get(library)[path]) {
    console.log(`${path} exists in the library already, using it and getting the current page`);

    // Get the latest page we were reading
    const page = get(currentBook).currentPage;
    console.log("Getting page", page);
    await sendGetPageRequest({ page: page, path });
  }
  // If it isn't in the library, go get it and start from the beginning
  else {
    console.log("This book isn't in the library yet.  Getting it.")
    const book = await setCurrentZip(path);
    library.update(existing => ({ ...existing, [path]: { ...book, currentPage: 0 } }));
    setCurrentPage(0);
    await sendGetPageRequest({ page: 0, path });
  }

  activeTab.set('View');
}

