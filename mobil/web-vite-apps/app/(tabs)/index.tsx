import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const router = useRouter();

  const joinQueue = async () => {
    try {
      // First, create or update the customer
      const customerResponse = await fetch("http://your-backend-url/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });
      const customer = await customerResponse.json();

      // Then, join the queue
      const queueResponse = await fetch("http://your-backend-url/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: customer.id, reason }),
      });
      const queue = await queueResponse.json();

      // Navigate to the status screen
      router.push({ pathname: "/status", params: { queueId: queue.id } });
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
});
