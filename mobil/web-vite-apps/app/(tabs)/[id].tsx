import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import axios from "axios";
import { baseurl } from "../config";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms";

interface Queue {
  id: number;
  reason: string;
  name: string;
  phone: string;
  status: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export default function QueueDetail() {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useLocalSearchParams();
  const user = useRecoilValue(authState);

  useEffect(() => {
    const fetchQueueDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Queue>(`${baseurl}/queue/${id}`);
        setQueue(response.data);
      } catch (err) {
        setError("Failed to fetch queue detail");
      } finally {
        setLoading(false);
      }
    };

    fetchQueueDetail();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (queue && user) {
      try {
        await axios.patch(`${baseurl}/queue/${id}`, {
          status: "attended",
          attendedBy: user.id,
        });
        setQueue((prevQueue) =>
          prevQueue ? { ...prevQueue, status: "attended" } : null
        );
        Alert.alert("Success", "Queue status updated to attended");
      } catch (err) {
        setError("Failed to update queue status");
      }
    }
  };

  const readQueueName = () => {
    if (queue) {
      Speech.speak(`Mr. ${queue.name}, please come to the desk. ${user.name}`, {
        language: "en",
      });
      Speech.speak(`Mr. ${queue.name}, we are ready for you. ${user.name}`, {
        language: "en",
      });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {queue && (
          <>
            <Text style={styles.title}>{queue.name}</Text>
            <Text>Reason: {queue.reason}</Text>
            <Text>Phone: {queue.phone}</Text>
            <Text>Position: {queue.position}</Text>
            <Text>Status: {queue.status}</Text>
            <Text>Created At: {queue.createdAt}</Text>
            <Text>Updated At: {queue.updatedAt}</Text>

            <Button title="Read Queue Name" onPress={readQueueName} />
            <Button title="Mark as Attended" onPress={handleUpdateStatus} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
