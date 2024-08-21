import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { baseurl } from "../config";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScannedUrl } from "../utils/url";

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
  const url = useScannedUrl();

  const router = useRouter();

  // Fetch queues data
  const fetchQueues = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Queue[]>(`${url}/queues`);
     
      setQueues(response.data);
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error fetching data:", err);
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
  }, [url]);

  useEffect(() => {
    fetchQueues();
  }, [url]);

  const handlePress = (id:any) => {
    router.push(`${id}`);
  };

  const renderItem = ({ item }: { item: Queue }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.reason}>{item.reason}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.position}>Position: {item.position}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error && !queues.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>{error}</Text>
        <Text> Server Address: {url}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignContent:"center",
    justifyContent:"center"
  },
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
