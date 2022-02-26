import { invoke } from '@tauri-apps/api/tauri'

export const test = async (input: string) => {
  console.log("test", input)
  await invoke('test', { input });
}

export const readFile = (path: string) => invoke<string>('read_file', { path })
export const setCurrentZip = (path: string) => invoke<string>('set_current_zip', { path })
export const incrementCounter = () => invoke<number>('counter', { countVal: 1 })
