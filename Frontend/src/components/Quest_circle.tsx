// Quest_circle.tsx
import React from "react";
import { StyleSheet, View, Image, ViewStyle } from "react-native";
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

interface QuestCircleProps {
  style?: ViewStyle;
}

export default function Quest_circle({ style }: QuestCircleProps) {
  return (
    <View style={[styles.imageContainer, style]}>
      <Image
        source={require("../assets/Images/quest_circle.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: height * 0.8,
    alignItems: "center",
    justifyContent: "flex-start", 
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
