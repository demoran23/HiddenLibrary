import { listen } from "@tauri-apps/api/event";
import { getItem, setItem } from 'localforage'
import type { Readable, Unsubscriber, Writable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';
import { sendGetPageRequest, setCurrentZip } from "../api/tauri";
import type { Book, GetPageResponse, Library, Page, Pages } from "../types";

const currentBookDefault: Book = { currentPage: 0 } as Book;
const pagesDefault: Pages = { bookPath: undefined };
const libraryDefault = {};

export let pages: Writable<Pages> = writable<Pages>(pagesDefault)
export let library: Writable<Library> = writable<Library>(libraryDefault);
export let currentBook: Readable<Book> = getCurrentBook();
export const activeTab = writable<string>('View');

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
    library.update(existing => ({ ...existing, [path]: book }));
    setCurrentPage(0);
    await sendGetPageRequest({ page: 0, path });
  }
  activeTab.set('View');

}

export const unsubscribers: Unsubscriber[] = [];

export const initializeStoreFromLocalStorage = async () => {
  try {
    await getItem<Library>('library').then(value => {
      library = writable(value ?? {} as Library);
      const u = library.subscribe((value) => {
        void setItem('library', value)
      })
      unsubscribers.push(u);
    });
    await getItem<Pages>('pages').then(value => {
      pages = writable(value ?? pagesDefault);
      const u = pages.subscribe((value) => {
        void setItem('pages', value)
      })
      unsubscribers.push(u);
    });

    await listen<GetPageResponse>('get-page-response', e => {
      const page: Page = { img: e.payload.contents, req: e.payload.request };
      pages.update(value => ({ ...value, [page.req.page]: page, bookPath: page.req.path }));
    });

    currentBook = getCurrentBook();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
