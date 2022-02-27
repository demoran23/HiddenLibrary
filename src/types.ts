export interface Page {
    req: GetPageRequest;
    img: string; // Base 64 encoded value for the image
}

export interface Pages {
    bookPath: string;
    [index: number]: Page
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

export interface Library {
    [path: string]: Book;
}