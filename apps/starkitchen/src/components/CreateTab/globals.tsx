export let tierlistIconFile: File | null = null;

// Function to update the global variable
export const updateGlobalSelectedFile = (file: File | null) => {
    tierlistIconFile = file;
    console.log('Global variable updated:', tierlistIconFile);
};