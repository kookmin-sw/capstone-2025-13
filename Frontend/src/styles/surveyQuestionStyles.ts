import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: width * 0.07,
        marginTop: 24,
    },
    questionBox: {
        backgroundColor: "#F9FAEC",
        borderRadius: 16,
        marginHorizontal: width * 0.05,
        marginTop: 25,
        paddingTop: 4,
        paddingBottom: 30,
    },
    questionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    numberBox: {
        backgroundColor: "#3CB46E",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 12,
    },
    numberText: {
        color: "white",
        fontWeight: "bold",
    },
    questionText: {
        fontSize: 16,
        fontWeight: "600",
        flexShrink: 1,
        color: "#222",
    },
    choicesWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    choiceItem: {
        alignItems: "center",
        justifyContent:"center",
        flex: 1,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#3CB46E",
        marginBottom: 4,
    },
    circleSelected: {
        backgroundColor: "transparent",
        borderWidth: 8,
        borderColor: "#3CB46E",
    },
    choiceLabel: {
        fontSize: 12,
        color: "#333",
        textAlign: 'center'
    },
    choiceLabelSelected: {
        color: "#3CB46E",
        fontWeight: "bold",
    },
});

export default styles;
