import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";

const questMeditationStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#0e0033",
  },
  container: {
    alignItems: "center",
  },
  timerText: {
    color: "#fff94f",
    fontFamily: fonts.laundryBold,
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  youtubeWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    borderRadius: 20,
    alignSelf: "center",
    position: "absolute",
    zIndex: 1,
  },
  buttonText: {
    color: "#fff",
    fontFamily: fonts.laundryBold,
  },
  missionTitle: {
    fontFamily: fonts.laundryBold,
    color: "#fff",
  },
  mainText: {
    fontFamily: fonts.laundryBold,
    color: "#fff",
  },
  warningTitle: {
    color: "#fff",
    fontFamily: fonts.laundry,
  },
  description: {
    color: "#ccc",
    fontFamily: fonts.laundry,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: fonts.laundryBold,
    color: "#fff94f",
    alignSelf: "flex-start",
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a40",
    borderRadius: 12,
    width: "100%",
  },
  thumbnail: {
    borderRadius: 8,
  },
  videoTextWrapper: {
    flexShrink: 1,
  },
  videoTitle: {
    color: "#fff",
    fontFamily: fonts.laundryBold,
    marginBottom: 2,
  },
  videoMeta: {
    color: "#ccc",
    fontFamily: fonts.laundry,
    fontSize: 12,
  },
});

export default questMeditationStyles;
