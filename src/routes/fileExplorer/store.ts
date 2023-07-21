// store.ts

import { writable } from 'svelte/store';

// Create a Svelte store to hold the contents of the currently open file
export const openFileContent = writable("");
export const originalFileContent = writable("");
export const isEditMode = writable(false);
export const openFileHandle = writable<FileSystemFileHandle | null>(null);
export const isJsonOnlyMode = writable(false);  // Store for JSON only mode
export const selectedFolder = writable("");  // Store for the selected folder
export const selectedFile = writable("");  // Store for the selected file
