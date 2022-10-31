import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [status, setStatus] = React.useState<string | null>(null);
  const [emoji, setEmoji] = React.useState<string | null>(null);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [fetchMessage, setFetchMessage] = React.useState<string | null>(null);
  const [fetchUrl, setFetchUrl] = React.useState<string | null>(null);

  const postStatus = async (status: string, emoji: string) => {
    const apiKey = await AsyncStorage.getItem("@apiKey");
    const address = await AsyncStorage.getItem("@address");
    if (!apiKey) {
      setFetchError("No API Key, click Settings on the bottom to set one!");
      return;
    }
    const res = await fetch(`https://api.omg.lol/address/${address}/statuses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey ?? "",
      },
      body: JSON.stringify({
        content: status ?? "",
        emoji: emoji ?? "",
      }),
    });
    const resJson = await res.json();

    if (res.status === 200) {
      setFetchMessage("Status updated!");
      setFetchUrl(resJson?.response.url);
    } else {
      setFetchError("Error setting status! " + resJson.message);
    }
  };

  function handleHelpPress() {
    WebBrowser.openBrowserAsync(fetchUrl ?? "https://status.lol/");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Status</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <KeyboardAvoidingView>
        <TextInput
          value={status ?? ""}
          placeholder="Status"
          multiline={false}
          style={{
            textAlign: "center",
            marginTop: 10,
            // border
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
            // padding
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onChangeText={(text) => setStatus(text)}
        />
        <TextInput
          value={emoji ?? ""}
          placeholder="Emoji"
          multiline={false}
          style={{
            textAlign: "center",
            marginTop: 10,
            // border
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
            // padding
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onChangeText={(text) => setEmoji(text)}
        />
        <Button
          onPress={async () => await postStatus(status ?? "", emoji ?? "")}
          title="Submit"
        />
        {fetchMessage && (
          <>
            <Text style={styles.title}>{fetchMessage}</Text>
            <TouchableOpacity onPress={handleHelpPress}>
              <Text>{fetchUrl}</Text>
            </TouchableOpacity>
          </>
        )}
        {fetchError && <Text style={{ color: "red" }}>{fetchError}</Text>}
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
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
});
