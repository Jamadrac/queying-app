// utils/scannedUrl.ts
import * as FileSystem from "expo-file-system";
import React, { useState, useEffect } from "react";
import { Button } from "react-native";

// URL variable
let url: string | null = null;

// Function to fetch the scanned URL
export const fetchScannedUrl = async () => {
  const fileUri = FileSystem.documentDirectory + "scannedData.json";
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(fileContent);
      url = data.url;
    } else {
      console.log("File does not exist");
    }
  } catch (error) {
    console.error("Error reading file", error);
  }
  return url;
};

// Clear URL function
export const clearUrl = async () => {
  const fileUri = FileSystem.documentDirectory + "scannedData.json";
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      url = null;
    } else {
      console.log("File not found, nothing to delete");
    }
  } catch (error) {
    console.error("Error clearing URL", error);
  }
};

// Clear URL Button component
export const ClearUrlButton = () => {
  // return <Button title="Clear URL" onPress={clearUrl} />;
};

// URL variable to be used in components
export { url };
