import { invoke } from '@tauri-apps/api/tauri';
export const test = async (input) => {
    console.log("test", input);
    await invoke('test', { input });
};
export const readFile = (path) => invoke('read_file', { path });
//# sourceMappingURL=index.js.map