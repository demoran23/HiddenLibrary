<script lang="ts">
    import DataTable, {Head, Body, Row, Cell} from '@smui/data-table';
    import {library} from "../store";
    import type {Book} from "../types";
    import {values} from "lodash-es";
    import {setCurrentBookPath} from "../store";

    let books: Book[] = [];
    library.subscribe(l => {
        books = values(l);
    })
</script>

<DataTable stickyHeader table$aria-label="User list" style="width: 100%;">
    <Head>
        <Row>
            <Cell numeric>Current</Cell>
            <Cell numeric>Pages</Cell>
            <Cell style="width: 100%;">Name</Cell>
        </Row>
    </Head>
    <Body>
    {#each books as book (book.path)}
        <Row on:click={() => {
            setCurrentBookPath(book.path);
        }}>
            <Cell>{book.currentPage}</Cell>
            <Cell numeric>{book.length}</Cell>
            <Cell>{book.name}</Cell>
        </Row>
    {:else}
        You don't have any books in your library yet. And them via TODO.
    {/each}
    </Body>
</DataTable>