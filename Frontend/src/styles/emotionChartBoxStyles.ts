// styles/emotionChartBoxStyles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#3CB46E",
        paddingBottom: 20,
        alignItems: "center",
    },
    box: {
        width: width * 0.85,
        height: width * 0.4,
        backgroundColor: "#E9F8ED",
        borderRadius: 20,
    },
    subtitle: {
        color: "#fff",
        marginTop: 10,
        fontSize: 14,
    },
});

export default styles;
