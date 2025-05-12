import { StyleSheet, Dimensions } from "react-native";
import fonts from "../constants/fonts";

const { width } = Dimensions.get("window");


const formalDiagnsisResultStyles = StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: "#1BA663",
    },
    container: {
      top: width * 0.02,
      alignItems: "center",
      backgroundColor: "#1BA663",
    },
    backButtonWrapper: {
      position: "absolute",
      left: width * 0.02,
      top: width* 0.085,
      padding: width * 0.05,
      zIndex: 11,
    },
    headerText: {
      marginTop: width * 0.15,
      marginBottom: width * 0.05,
      marginStart: width * 0.19,
      fontSize: width * 0.055,
      fontFamily: fonts.semiBold,
      textAlign: "left",
      color: "#F9F9EB",
      fontWeight: "bold",
    },
    resultBox: {
      width: "85%",
      backgroundColor: "#F9F9EB",
      borderRadius: 20,
      padding: width * 0.05,
      alignItems: "center",
      elevation: 4,
    },
    title: {
      fontSize: width * 0.045,
      fontFamily: fonts.semiBold,
      marginBottom: width * 0.02,
      textAlign: "left",
      alignSelf: "flex-start",
    },
    name: {
      fontFamily: fonts.semiBold,
      fontWeight: "bold",
      color: "#4CAF50",
    },
    chartWrapper: {
      justifyContent: "center",
      alignItems: "center",
    },
    chart: {
      position: "relative",
    },
    percentText: {
      fontFamily: fonts.extraBold,
      position: "absolute",
      fontSize: width * 0.07,
      fontWeight: "bold",
      color: "#333",
    },
    status: {
      fontFamily: fonts.extraBold,
      fontSize: width * 0.06,
      fontWeight: "bold",
      color: "#4CAF50",
      marginBottom: width * 0.05,
    },
    section: {
      width: "100%",
      marginTop: width * 0.05,
      marginBottom: width * 0.05,
    },
    sectionTitle: {
      fontFamily: fonts.semiBold,
      fontWeight: "bold",
      fontSize: width * 0.045,
      marginBottom: width * 0.015,
    },
    sectionText: {
      fontFamily: fonts.primary,
      fontSize: width * 0.035,
      color: "#333",
      lineHeight: width * 0.05,
    },
  });
  
  export default formalDiagnsisResultStyles;