<!-- src/routes/FileExplorer.svelte -->

<script lang="ts">
    import { writable } from 'svelte/store';
  
    // Define a type for the contents of a folder
    interface FolderContent {
      kind: string;
      name: string;
    }
  
    // Create a Svelte store to hold the folder handle
    let folderHandle = writable<null | any>(null);
  
    // Create a Svelte store to hold the contents of the folder
    let folderContents = writable<FolderContent[]>([]);
  
    // Function to open the directory picker and store the selected folder
    async function selectFolder() {
      const handle = await window.showDirectoryPicker();
      folderHandle.set(handle);
  
      // Get the contents of the selected folder and store them
      const contents: FolderContent[] = [];
      for await (const entry of handle.values()) {
        contents.push({ kind: entry.kind, name: entry.name });
      }
      folderContents.set(contents);
    }
  </script>
  
  <!-- Button to select a folder -->
  <button id="select-folder-button" on:click={selectFolder}>
    Select Folder
  </button>
  
  <!-- List of the selected folder's contents -->
  <ul>
    {#each $folderContents as item}
      <li>{item.name}</li>
    {/each}
  </ul>
  