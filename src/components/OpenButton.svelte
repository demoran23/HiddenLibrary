<script lang="ts">
  import { open } from '@tauri-apps/api/dialog'
  import { Button } from 'carbon-components-svelte';
  import { setCurrentBookPath } from "../store";

  async function openFileDialog() {
    return open({
      title: "Select a zip file",
      filters: [{ name: "zip", extensions: ["zip"] }]
    }).then(setCurrentBookPath);
  }
</script>

<Button
    on:click={openFileDialog}>
    Open
</Button>
