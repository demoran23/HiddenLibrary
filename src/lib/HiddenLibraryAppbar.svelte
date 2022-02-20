<script lang="ts">
  import { Appbar, Button, Searchbar } from 'framework7-svelte';
</script>

<Appbar>
    <div class="left">
        <Button small panelToggle="left" class="display-flex" iconF7="bars"/>
        <Button small class="display-flex margin-left-half" iconF7="square_list"/>
        <Button small class="display-flex margin-left-half" iconF7="arrowshape_turn_up_left_fill"/>
    </div>
    <div class="right">
        <Searchbar
                inline
                customSearch
                disableButton={false}
        />
    </div>
</Appbar>
