<script lang="ts">
  import { DataTable } from 'carbon-components-svelte';
  import { values } from "lodash-es";
  import { library } from "../store";
  import type { Book } from "../types";

  let books: Book[] = [];
  library.subscribe(l => {
    books = values(l);
  })
</script>

<DataTable headers={[
    { key: "currentPage", value: "Current" },
    { key: "length", value: "Pages" },
    { key: "name", value: "Name" },
  ]} rows={books} style="width: 100%;">

    <!--{#each books as book (book.path)}-->
    <!--    <Row on:click={() => {-->
    <!--        setCurrentBookPath(book.path);-->
    <!--    }}>-->
    <!--        <Cell>{book.currentPage}</Cell>-->
    <!--        <Cell numeric>{book.length}</Cell>-->
    <!--        <Cell>{book.name}</Cell>-->
    <!--    </Row>-->
    <!--{:else}-->
    <!--    You don't have any books in your library yet. And them via TODO.-->
    <!--{/each}-->
</DataTable>
