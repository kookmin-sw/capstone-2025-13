// styles/sectionLabelStyles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 8,
        paddingHorizontal: width * 0.07,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#3CB46E",
    },
});

export default styles;
