// screens/Home.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { baseurl } from "../config";
import { fetchScannedUrl, url, ClearUrlButton } from "../utils/scannedUrl";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchScannedUrl(); // Fetch the URL when the component mounts
  }, []);

  const joinQueue = async () => {
    try {
      // Use the fetched URL to join the queue
      const response = await fetch(`${baseurl}/queue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, reason }),
      });
      const queue = await response.json();

      // Navigate to the status screen with the queue ID
      // router.push("/(tabs)")
    } catch (error) {
      console.error("Error joining queue:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Queue</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Reason for Visit"
        value={reason}
        onChangeText={setReason}
      />
      <Button title="Join Queue" onPress={joinQueue} />

      {url && (
        <View style={styles.urlContainer}>
          <Text>Scanned URL: {url}</Text>
          {/* <ClearUrlButton />  */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  urlContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
