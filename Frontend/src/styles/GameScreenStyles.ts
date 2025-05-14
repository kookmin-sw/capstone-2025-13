import { StyleSheet } from "react-native";
import fonts from "../constants/fonts";
import colors from "../constants/colors";

export const gameScreenstyles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 50,
    backgroundColor:"#EEF7E8" 
  },
  title: { 
    fontSize: 28, 
    marginBottom: 50, 
    marginTop:30 , 
    fontFamily: fonts.laundryBold, 
    color:"#349C64"
  },
  gridContainer: { 
    flex: 1,  
    alignItems: 'center' 
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 320,
  },
  result: { 
    marginBottom: 50
  },
  success: { 
    fontSize: 22, 
    color: '#349C64', 
    marginBottom: 10, 
    textAlign:'center', 
    fontFamily:fonts.laundryBold 
  },
  timeTaken: {
    fontSize: 18,
    fontWeight: '600',
    color: '#349C64',
    marginTop: 10,
    fontFamily:fonts.laundryBold,
    textAlign:'center'
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
    alignContent: "center",
    justifyContent: "center",
    gap: 10,
  },
  endButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.lightBrown,
    borderRadius: 40,
    width: "45%",
    height: 45,
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4,
    elevation: 5, 
  },
  endText: {
    color: colors.white,
    fontFamily: fonts.laundryBold,
  },
  againButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.lightGreen,
    borderRadius: 40,
    width: "45%",
    height: 45,
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: '#349C64',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  againText:{
    color: colors.white,
    fontFamily: fonts.laundryBold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#F9FAEC',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320, 
  },
  modalTitle: {
    fontSize: 24,
    color: '#349C64',
    fontFamily: fonts.bold,
    marginBottom: 15,
  },
  modalTime: {
    fontSize: 18,
    color: '#349C64',
    fontWeight: '600',
    marginBottom: 20,
  },
});
