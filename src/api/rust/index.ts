import { invoke } from '@tauri-apps/api/tauri'

export const test = async (input: string) => {
  console.log("test", input)
  await invoke('test', { input });
}

export const readFile = async (path: string) => {
  await invoke('read_file', { path });
}
