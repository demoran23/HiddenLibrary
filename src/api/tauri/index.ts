import { emit } from "@tauri-apps/api/event";
import { invoke } from '@tauri-apps/api/tauri'
import type { GetPageRequest, ZipInfo } from "../../types";

export const setCurrentZip = (path: string) => invoke<ZipInfo>('set_current_zip', { path })
export const sendGetPageRequest = (req: GetPageRequest) => emit('get-page-request', req);
