// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	interface Window {
	  showDirectoryPicker: () => Promise<any>;
	}
  }
  
export {};
