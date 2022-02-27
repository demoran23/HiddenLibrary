import { invoke } from '@tauri-apps/api/tauri'
import type {ZipInfo} from "../../types";

export const setCurrentZip = (path: string) => invoke<ZipInfo>('set_current_zip', { path })
