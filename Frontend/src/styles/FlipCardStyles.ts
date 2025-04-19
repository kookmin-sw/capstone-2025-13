import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
    cardContainer: {
        position: 'relative',  // 카드 앞뒤를 겹치게 하기 위해 relative로 설정
        width: 70,
        height: 90,
        margin: 5,
    },
    card: {
        position: 'absolute', // 카드가 겹쳐져서 보이게 하기 위해 absolute로 설정
        width: 70,
        height: 90,
        backfaceVisibility: 'visible', // 뒷면이 보이도록 설정
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 1, height: 2 },
    },
    front: {
        backgroundColor: '#fff',
    },
    back: {
        backgroundColor: '#bbb',
    },
    text: {
        fontSize: 28,
    },
});
