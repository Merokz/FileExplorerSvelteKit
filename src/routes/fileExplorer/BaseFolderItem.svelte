<!-- BaseFolderItem.svelte -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import FolderItem from "./FolderItem.svelte";

  const dispatch = createEventDispatcher();

  export let item: {
    kind: string;
    name: string;
    handle: any;
    isOpen: boolean;
    contents: {
      kind: string;
      name: string;
      handle: any;
      isOpen: boolean;
      contents: any[];
    }[];
  };
  export let toggleFolderOpen: (item: any) => Promise<void>;
  export let loadSubfolderContents: (item: any) => Promise<void>;

  function handleClick() {
    dispatch("click");
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      dispatch("click");
    }
  }

</script>

<li>
  <button
    tabindex="0"
    on:click={handleClick}
    on:keydown={handleKeydown}
    on:click={() => item.kind === "directory" && toggleFolderOpen(item)}
    on:keydown={(e) =>
      e.key === "Enter" && item.kind === "directory" && toggleFolderOpen(item)}
  >
    {item.name}
  </button>
  {#if item.kind === "directory" && item.isOpen}
    <ul>
      {#each item.contents as child (child.name)}
        <FolderItem item={child} {toggleFolderOpen} {loadSubfolderContents} />
      {/each}
    </ul>
  {/if}
</li>

<style>
  ul {
    margin-left: 1rem;
  }
</style>
