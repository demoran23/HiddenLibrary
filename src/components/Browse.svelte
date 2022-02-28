<script lang="ts">
  import { DataTable } from 'carbon-components-svelte';
  import { values } from "lodash-es";
  import { library, setCurrentBookPath } from "../store";
  import type { Book } from "../types";

  let books: Book[] = [];
  library.subscribe(l => {
    books = values(l).map<Book>(r => ({ ...r, id: r.name }));
  })

  function onClickRow(e: { detail: Book }) {
    return setCurrentBookPath(e.detail.path)
  }
</script>

<DataTable
    headers={[
        { key: "currentPage", value: "Current" },
        { key: "length", value: "Pages" },
        { key: "name", value: "Name" },
        ]}
    on:click:row={onClickRow}
    rows={books}
    style="width: 100%;">
</DataTable>
