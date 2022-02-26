import { invoke } from '@tauri-apps/api/tauri'

export const readFile = (path: string) => invoke<string>('read_file', { path })
export const setCurrentZip = (path: string) => invoke<unknown>('set_current_zip', { path })
export const incrementCounter = () => invoke<number>('counter', { countVal: 1 })
