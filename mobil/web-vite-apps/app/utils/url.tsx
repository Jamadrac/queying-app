// urlManager.ts
import * as FileSystem from "expo-file-system";
import { useState, useEffect } from "react";

// Function to fetch the URL from the file system
export const useScannedUrl = () => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const fileUri = FileSystem.documentDirectory + "scannedData.json";
      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          const data = JSON.parse(fileContent);
          setUrl(data.url);
        } else {
          console.log("File does not exist");
        }
      } catch (error) {
        console.error("Error reading file", error);
      }
    };

    fetchUrl();
  }, []);

  return url;
};

// Function to clear the URL from the file system
export const clearScannedUrl = async () => {
  const fileUri = FileSystem.documentDirectory + "scannedData.json";
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      return true; // Return true if successful
    } else {
      console.log("File not found, nothing to delete");
      return false; // Return false if the file does not exist
    }
  } catch (error) {
    console.error("Error clearing URL", error);
    return false; // Return false if there was an error
  }
};
