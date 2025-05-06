import { StyleSheet, Dimensions } from "react-native";
import fonts from '../constants/fonts';

const { width, height } = Dimensions.get("window");

const userInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
  },
  header: {
    fontSize: width * 0.09,
    textAlign: "center",
    marginBottom: height * 0.02,
    fontFamily: fonts.extraBold,
    color: "#fff",
  },
  whiteBox: {
    backgroundColor: "#fff",
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: "center",
  },
  avatar: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    marginBottom: height * 0.01,
  },
  nickname: {
    fontSize: width * 0.05,
    textAlign: "center",
    fontFamily: fonts.extraBold,
    marginBottom: height * 0.01,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: height * 0.015,
    width: "100%",
  },
  label: {
    fontSize: width * 0.04,
    fontFamily: fonts.semiBold,
    color: "#333",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: width * 0.5,
    padding: 5,
    fontFamily: fonts.primary,
    fontSize: width * 0.04,
  },
  genderOptions: {
    flexDirection: "row",
  },
  genderButton: {
    padding: width * 0.025,
    borderRadius: 5,
    marginHorizontal: width * 0.01,
    backgroundColor: "#f0f0f0",
    fontFamily: fonts.semiBold,
  },
  genderSelected: {
    backgroundColor: "#4CAF50",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.03,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: width * 0.025,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: width * 0.025,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
  },
  logOutButton: {
    backgroundColor: "#ccc",
    padding: width * 0.025,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: "center",
  },
  button: {
    marginVertical: height * 0.015,
    padding: width * 0.03,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    width: width * 0.5,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: fonts.semiBold,      
    fontSize: width * 0.03,         
    color: "black"               
  },
  Text: {
    fontFamily: fonts.primary,      
    fontSize: width * 0.035,         
    color: "black"               
  },
  backButton: {
    position: "absolute",
    top: height * 0.06,   // 전체 높이의 5% 위치
    left: width * 0.05,   // 전체 너비의 5% 위치
    zIndex: 10,
  },
});

export default userInfoStyles;
