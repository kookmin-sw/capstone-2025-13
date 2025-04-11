import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const questStageStyles = StyleSheet.create({
    street: {
        position: "absolute",
        top: width / 1.7, 
        left: width / 2, 
        transform: [{ translateX: -width / 2 }, { rotate: "50deg" }],
        width: width,
        height: width,
        opacity: 0.8,
        zIndex: 2,
      },
      goalImage: {
        position: "absolute",
        top: width / 2,
        left: width / 2.5,
        width: width * 0.15,
        height: width * 0.2,
        zIndex: 3,
    },
      
    });

export default questStageStyles;