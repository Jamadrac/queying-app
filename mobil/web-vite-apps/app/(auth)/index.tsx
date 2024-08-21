import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { baseUrlAtom } from "../recoil/atoms";
import { useRouter } from "expo-router";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import * as FileSystem from "expo-file-system";

export default function QRCodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useRecoilState(baseUrlAtom);
  const router = useRouter();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    setScannedData(data);
  };

  const handleConfirm = async () => {
    if (scannedData) {
      setBaseUrl(scannedData);

      // Save data to a JSON file in local storage
      const fileUri = FileSystem.documentDirectory + "scannedData.json";
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ url: scannedData }));

      // Navigate to the view URL screen
      router.push("/view-url");

      // Optionally, delete the JSON file after navigating
      // await FileSystem.deleteAsync(fileUri);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={styles.highlighter} />
      </BarCodeScanner>

      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title="Confirm Scan" onPress={handleConfirm} />
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  highlighter: {
    flex: 1,
    margin: 40,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "80%",
    justifyContent: "space-around",
  },
});
