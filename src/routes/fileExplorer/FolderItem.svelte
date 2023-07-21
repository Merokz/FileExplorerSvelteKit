<!-- FolderItem.svelte -->

<script lang="ts">
  import BaseFolderItem from "./BaseFolderItem.svelte";
  import { openFileContent, openFileHandle, isEditMode, originalFileContent, selectedFile } from "./store";

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

  // Function to open a file and read its contents
  async function openFile(item: any) {
    console.log("Opening file", item.name);
    if (item.kind === "file") {
      const file = await item.handle.getFile();
      const text = await file.text();
      openFileContent.set(text); // Update the store with the file's contents
      originalFileContent.set(text); // Store the original contents
      openFileHandle.set(item.fileHandle);
      selectedFile.set(file.name); // Set the name of the selected file
      isEditMode.set(false); // Leave edit mode when a new file is opened
    }
  }

 
</script>

<BaseFolderItem
  {item}
  {toggleFolderOpen}
  {loadSubfolderContents}
  on:click={() => openFile(item)}
/>
