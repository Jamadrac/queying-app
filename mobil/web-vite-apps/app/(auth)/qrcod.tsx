// screens/QRCodeScannerScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { baseUrlAtom } from "../recoil/atoms";
import { useRouter } from "expo-router";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";

export default function QRCodeScannerScreen() {
  // State types
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useRecoilState(baseUrlAtom);
  const router = useRouter();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    setBaseUrl(data);
    router.replace("/(tabs)");
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
      />

      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
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
});
