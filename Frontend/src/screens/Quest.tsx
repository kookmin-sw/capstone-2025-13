import React from "react";
import { View, StyleSheet } from "react-native";
import Header_sky from "../components/Header_sky";
import Quest_circle from "../components/Quest_circle";

export default function Quest() {
  return (
    <View style={styles.container}>
      <Header_sky />
      <Quest_circle />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
