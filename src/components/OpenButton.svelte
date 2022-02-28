<script lang="ts">
    import {setCurrentBookPath} from "../store";
    import {open} from '@tauri-apps/api/dialog'
    import Button, {Label} from '@smui/button';

    async function openFileDialog() {
        return open({
            title: "Select a zip file",
            filters: [{name: "zip", extensions: ["zip"]}]
        }).then(setCurrentBookPath);
    }
</script>

<Button on:click={openFileDialog}>
    <!--        <Icon class="material-icons">favorite</Icon>-->
    <Label>Open</Label>
</Button>
