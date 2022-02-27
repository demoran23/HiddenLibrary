import { invoke } from '@tauri-apps/api/tauri'
import type {Book, GetPageRequest} from "../../types";
import {emit} from "@tauri-apps/api/event";

export const setCurrentZip = (path: string) => invoke<Book>('set_current_zip', { path })
export const sendGetPageRequest = (req: GetPageRequest) => emit('get-page-request', req);
