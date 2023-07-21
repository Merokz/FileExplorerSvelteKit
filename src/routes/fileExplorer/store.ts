// store.ts

import { writable } from 'svelte/store';

// Create a Svelte store to hold the contents of the currently open file
export const openFileContent = writable("");
export const originalFileContent = writable("");
export const isEditMode = writable(false);
export const openFileHandle = writable<FileSystemFileHandle | null>(null);