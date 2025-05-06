import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const userInfoStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#4CAF50", justifyContent: "center" },
  header: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  whiteBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "100%",
  },
  label: { fontSize: 16, color: "#333" },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: 200,
    padding: 5,
    fontSize: 16,
  },
  genderOptions: { flexDirection: "row" },
  genderButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
  },
  genderSelected: {
    backgroundColor: "#4CAF50",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "30%",
    alignItems: "center",
  },
  logOutButton: {
    backgroundColor: "#ccc",
    padding: 10,
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
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
});


export default userInfoStyles;
