import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");

const headerSkyStyles = StyleSheet.create({
    background: {
      width: '100%',
      height: width * 0.5,   
      justifyContent: "center",
      alignItems: "flex-start",
    },
    container: {
      alignItems: "flex-start",
      justifyContent: "center",
    },
    title: {
      fontSize: width * 0.08,  
      paddingLeft: width * 0.07,
      fontFamily: fonts.extraBold,
      color: "#fff",
    },
    subtitle: {
      fontSize: width * 0.035,
      paddingLeft: width * 0.07, 
      fontFamily: fonts.bold,   
      color: "#fff",
      marginTop: width * 0.01,
    },
  });
  

export default headerSkyStyles;