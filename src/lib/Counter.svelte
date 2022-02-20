<script lang="ts">
  import { readFile } from '../api/rust';

  let imgBase64: string = '';
  const readFileHandler = async () => {
    let elementById = document.getElementById("filePath") as HTMLInputElement;
    imgBase64 = await readFile(elementById.value)
  }
</script>
<div>
    <input id="filePath"/>
    <button on:click={readFileHandler}>Test</button>
    {#if imgBase64}
        <img src="data:image/png;base64, {imgBase64}"/>
    {/if}
</div>
<style>
    button {
        font-family: inherit;
        font-size: inherit;
        padding: 1em 2em;
        color: #ff3e00;
        background-color: rgba(255, 62, 0, 0.1);
        border-radius: 2em;
        border: 2px solid rgba(255, 62, 0, 0);
        outline: none;
        width: 200px;
        font-variant-numeric: tabular-nums;
        cursor: pointer;
    }

    button:focus {
        border: 2px solid #ff3e00;
    }

    button:active {
        background-color: rgba(255, 62, 0, 0.2);
    }
</style>
