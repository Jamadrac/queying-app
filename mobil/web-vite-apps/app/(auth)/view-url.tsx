// screens/ViewUrlScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";

export default function ViewUrlScreen() {
  const [url, setUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUrl = async () => {
      const fileUri = FileSystem.documentDirectory + "scannedData.json";
      try {
        // Check if the file exists
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

  const clearUrl = async () => {
    const fileUri = FileSystem.documentDirectory + "scannedData.json";
    try {
      // Check if the file exists before trying to delete it
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri);
        setUrl(null);
      } else {
        console.log("File not found, nothing to delete");
      }
    } catch (error) {
      console.error("Error clearing URL", error);
    }
  };

  if (url === null) {
    return <Text>No URL available. Please scan a new QR code.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Scanned URL:</Text>
      <Text>{url}</Text>
      <Button title="Clear URL" onPress={clearUrl} />
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
