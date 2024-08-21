// screens/Home.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ToastAndroid } from "react-native";
import { useRouter } from "expo-router";
import { fetchScannedUrl, url } from "../utils/scannedUrl";
import { useScannedUrl } from "../utils/url";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(""); // State for error messages
  const router = useRouter();
  const url = useScannedUrl();

  useEffect(() => {
    fetchScannedUrl(); // Fetch the URL when the component mounts
  }, []);

  const joinQueue = async () => {
    setLoading(true); // Start loading
    setError(""); // Clear any previous error

    try {
      // Use the fetched URL to join the queue
      const response = await fetch(`${url}/queue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to join queue");
      }

      const queue = await response.json();

      // Display success notification
      ToastAndroid.show("Joined queue successfully!", ToastAndroid.SHORT);

      // Clear input fields
      setName("");
      setPhone("");
      setReason("");

      // Navigate to the status screen with the queue ID
      // router.push("/(tabs)")
    } catch (error) {
      console.error("Error joining queue:", error);
      setError("Error joining queue. Please try again.");
      // Display error notification
      ToastAndroid.show("Failed to join queue.", ToastAndroid.SHORT);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Queue</Text>
      <Text>Server Address: {url}</Text>
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Join Queue" onPress={joinQueue} />
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
