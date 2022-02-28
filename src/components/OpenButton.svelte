<script lang="ts">
    import {setCurrentBookPath} from "../store";
    import {open} from '@tauri-apps/api/dialog'
    import {Button} from 'carbon-components-svelte';

    async function openFileDialog() {
        return open({
            title: "Select a zip file",
            filters: [{name: "zip", extensions: ["zip"]}]
        }).then(setCurrentBookPath);
    }
</script>

<Button label="Open" on:click={openFileDialog}>
    <!--        <Icon class="material-icons">favorite</Icon>-->
</Button>
