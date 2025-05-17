import { StyleSheet } from 'react-native';
import fonts from '../constants/fonts';
import colors from '../constants/colors';

export default StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  list: {
    
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
  },
  barWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF9B4B',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 999,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dialogueBox: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        // height: "25%"
     
    },
    nametag: {
        position: "absolute",
        top: -20,
        left: 30,
        zIndex: 10,
        width: 100,
        height: 40,
        borderRadius: 10,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: colors.lightBrown,
    },
    nametagText: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
        fontFamily: fonts.semiBold,
    },
    dialogueTextBox: {
        position: "relative",
        padding: 50,
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        borderRadius: 20

    },
    dialogueText: {
        fontSize: 16,
        color: "black",
        fontFamily: fonts.dialogue,
    },
});
