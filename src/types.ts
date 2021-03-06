export interface Pages {
  bookPath: string;

  [index: number]: string
}

export interface GetPageRequest {
  page: number; // index of the page in the source zip
  path: string; // path of the source zip
}

export interface GetPageResponse {
  request: GetPageRequest;
  contents: string; // Base 64 encoded value for the image
}

export interface Book {
  length: number;
  path: string;
  name: string;
  currentPage: number;
}

export interface ZipInfo {
  length: number;
  path: string;
  name: string;
  current_page: number;
}

export interface Library {
  [path: string]: Book;
}
