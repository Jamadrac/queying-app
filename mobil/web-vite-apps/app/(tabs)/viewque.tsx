import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { baseurl } from "../config";

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

export default function QueueList() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch queues data
  const fetchQueues = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Queue[]>(`${baseurl}/queues`);
      setQueues(response.data);
    } catch (err) {
      setError("Failed to fetch queues");
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQueues();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchQueues();
  }, []);

  const renderItem = ({ item }: { item: Queue }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.reason}>{item.reason}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
      <Text style={styles.position}>Position: {item.position}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Queue List</Text>
      <FlatList
        data={queues}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
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
  item: {
    padding: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reason: {
    fontSize: 16,
  },
  phone: {
    fontSize: 16,
    color: "gray",
  },
  position: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
