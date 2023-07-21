<!-- src/routes/fileExplorer/+page.svelte -->

<script lang="ts">
    import { writable } from "svelte/store";
    import FolderItem from "./FolderItem.svelte";
    import {
        openFileContent,
        openFileHandle,
        originalFileContent,
        isEditMode,
    } from "./store";

    // Define a type for the contents of a folder
    interface FolderContent {
        kind: string;
        name: string;
        handle: any;
        isOpen: boolean;
        contents: FolderContent[];
        fileHandle: FileSystemFileHandle | null;
    }
    // Create a Svelte store to hold the folder handle
    let folderHandle = writable<null | any>(null);
    // Create a Svelte store to hold the contents of the folder
    let folderContents = writable<FolderContent[]>([]);

    // Recursive function to get the contents of a directory
    async function getDirectoryContents(handle: any): Promise<FolderContent[]> {
        const contents: FolderContent[] = [];
        for await (const entry of handle.values()) {
            const childItem: FolderContent = {
                kind: entry.kind,
                name: entry.name,
                handle: entry,
                isOpen: false,
                contents: [],
                fileHandle: entry.kind === "file" ? entry : null,
            };
            if (childItem.kind === "directory") {
                childItem.name = `📂 ${childItem.name}`;
                childItem.contents = await getDirectoryContents(entry);
            } else {
                childItem.name = `📄 ${childItem.name}`;
            }
            contents.push(childItem);
        }
        return contents;
    }

    // Function to toggle the isOpen attribute of a folder
    async function toggleFolderOpen(item: any) {
        item.isOpen = !item.isOpen;
        if (item.isOpen && item.contents.length === 0) {
            // If the folder is being opened and its contents haven't been loaded before, load them now
            await loadSubfolderContents(item);
        }
        // Notify Svelte about the changes
        $folderContents = $folderContents;
    }

    // Function to load the contents of a subfolder
    async function loadSubfolderContents(item: any) {
        item.contents = await getDirectoryContents(item.handle);
        // Notify Svelte about the changes
        $folderContents = $folderContents;
    }

    // Modify the selectFolder function to load only the contents of the root folder
    async function selectFolder() {
        const handle = await window.showDirectoryPicker();
        if (!handle) {
            console.log("No handle provided or obtained, exiting selectFolder");
            return;
        }
        folderHandle.set(handle);
        folderContents.set(await getDirectoryContents(handle));
    }

    function editFile() {
        if ($isEditMode) {
            // If we're already in edit mode, switch back to view mode without saving changes
            openFileContent.set($originalFileContent);
            isEditMode.set(false);
        } else {
            // If we're not in edit mode, switch to edit mode
            isEditMode.set(true);
        }
    }

    async function saveFile() {
        const handle = $openFileHandle;
        if (!handle) {
            console.log("No file is currently open for editing");
            return;
        }

        const writable = await handle.createWritable();
        await writable.write($openFileContent);
        await writable.close();

        isEditMode.set(false);
    }
</script>

<div class="container">
    <div class="button-container">
        <!-- Button to select a folder -->
        <button id="select-folder-button" on:click={() => selectFolder()}>
            Select Folder
        </button>

        <!-- Button to refresh the folder contents -->
        <button id="refresh-folder-button" on:click={() => selectFolder()}>
            Refresh Folder
        </button>
    </div>

    <!-- List of the selected folder's contents -->
    <ul>
        {#each $folderContents as item (item.name)}
            <FolderItem {item} {toggleFolderOpen} {loadSubfolderContents} />
        {/each}
    </ul>
</div>
<div class="right-side">
    {#if $openFileContent}
        <button on:click={editFile}>Edit</button>
        <button on:click={saveFile}>Save</button>
        {#if $isEditMode}
            <textarea class="editable" bind:value={$openFileContent} />
        {/if}
        {#if !$isEditMode}
            <pre>{$openFileContent}</pre>
        {/if}
    {/if}
</div>

<style>
    .right-side {
        width: 50%;
        height: 600px;
        padding: 20px;
        border: 1px solid #ddd;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        overflow: auto;
        position: fixed;
        right: 0;
    }
    .container {
        min-width: 250px; /* Set a fixed width */
        width: fit-content;
        height: 400px; /* Set a fixed height */
        margin: auto 100; /* Align to the left */
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        overflow: auto; /* Make the container scrollable */
    }
    .button-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .right-side .editable {
        background: none;
        border: none;
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 1.05em;
        letter-spacing: inherit;
        word-spacing: inherit;
        line-height: inherit;
        font-family: inherit;
        white-space: pre-wrap;
        overflow: auto;
        color: inherit;
        outline: none;
    }
</style>
