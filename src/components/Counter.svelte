<script lang="ts">
    import {
        incrementCounter,
        readFile,
        setCurrentZip
    } from '../api/rust';

    let imgBase64: string = '';
    let count: number = 0;
    const readFileHandler = async () => {
        const elementById = document.getElementById("file_path") as HTMLInputElement;
        imgBase64 = await readFile(elementById.value)
    }
    const zipHandler = async () => {
        const elementById = document.getElementById("file_path") as HTMLInputElement;
        const zipInfo = await setCurrentZip(elementById.value)
        console.log(zipInfo);
    }

    const counterHandler = async () => {
        console.log("clicked!")
        count = await incrementCounter();
    }
</script>
<div>
    <input id="file_path" value="H:\[Ayakase Chiyoko] 3 vs 1 Volleyball Match 2 Home Game (x3200) [FAKKU].zip"/>
    <button on:click={readFileHandler}>Show image</button>
    <button on:click={zipHandler}>Set Current Zip</button>
    <span>{count}</span>
    <button on:click={counterHandler}>Increment Counter</button>
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
