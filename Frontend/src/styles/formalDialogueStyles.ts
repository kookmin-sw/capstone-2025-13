// styles/formalDialogueStyles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFCEC",
    },
    scroll: {
        paddingBottom: 40,
    },
});

export default styles;
