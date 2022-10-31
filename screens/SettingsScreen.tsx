import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Button, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Text, TextInput, View } from "../components/Themed";

export default function TabTwoScreen() {
  const [settingsError, setSettingsError] = React.useState<string | null>(null);

  // there HAS to be a better way to do this
  let apiKeyStart: string | null = null;
  // get the api key from async storage
  AsyncStorage.getItem("@apiKey").then((value) => {
    apiKeyStart = value;
  });
  let addressStart: string | null = null;
  // get the address from async storage
  AsyncStorage.getItem("@address").then((value) => {
    addressStart = value;
  });
  const [apiKey, setApiKey] = React.useState<string>(apiKeyStart ?? "");
  const [address, setAddress] = React.useState<string>(addressStart ?? "");

  const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem("@" + key, value);
    } catch (e: any) {
      setSettingsError(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.title}>API Key</Text>
      <KeyboardAvoidingView>
        <TextInput
          value={apiKey ?? ""}
          placeholder="Input Here"
          multiline={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="visible-password"
          style={{
            textAlign: "center",
          }}
          onChangeText={(text) => setApiKey(text)}
        />
        <Text style={styles.title}>Address</Text>
        <TextInput
          value={address ?? ""}
          placeholder="Input Here"
          multiline={false}
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            textAlign: "center",
          }}
          onChangeText={(text) => setAddress(text)}
        />
        <Button
          onPress={async () => {
            await storeData("apiKey", apiKey);
            await storeData("address", address);
          }}
          title="Save"
        />
        {settingsError && <Text style={{ color: "red" }}>{settingsError}</Text>}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
});
