import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { RootStackParamList } from "../../App";

type GameNavigationProp = NativeStackNavigationProp<RootStackParamList, "Game">;

const Game = () => {
    const navigation = useNavigation<GameNavigationProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'Game'>>();
    const score = route.params?.score ?? 0;
    console.log("Game screen loaded with score:", score);
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("GameScreen")}
            >
                <Text style={styles.buttonText}>게임 스타트</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Game;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa", // 연한 회색 배경
    },
    button: {
        backgroundColor: "#4CAF50", // 녹색 계열
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        elevation: 3, // 안드로이드 그림자
        shadowColor: "#000", // iOS 그림자
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
