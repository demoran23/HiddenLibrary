import { invoke } from '@tauri-apps/api/tauri'
import type {Book} from "../../types";

export const setCurrentZip = (path: string) => invoke<Book>('set_current_zip', { path })
