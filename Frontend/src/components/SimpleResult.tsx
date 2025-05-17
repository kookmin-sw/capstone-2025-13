import { View, Image, Text, StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get('window');

interface SimpleResultProps {
    simpleScale: string;
}

export default function SimpleResult({ simpleScale }: SimpleResultProps) {
    console.log(simpleScale);
    let text = "";
    switch (simpleScale) {
        case '심한 우울증':
            text = `약식검사를 완료했어!\n현재 심한 우울증 상태야.\n함께 천천히 극복해보자!`;
            break;
        case '중증도 우울증':
            text = `약식검사를 완료했어!\n중증도 우울증이 의심돼.\n적극적으로 관리해보자!`;
            break;
        case '경미한 우울증':
            text = `약식검사를 완료했어!\n약간의 우울감이 있구나,\n나랑 함께 극복해보자!`;
            break;
        case '정상':
        default:
            text = `약식검사를 완료했어!\n지금은 건강한 상태야!\n그래도 나랑 잘 지내보자!`;
            break;
    }
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/Images/simple_clover_4-3.png')}
                style={styles.image}
            />
            <View style={styles.speechBubble}>
                <Text style={styles.bubbleText}>
                    {text}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end', // ✅ 말풍선 기준으로 이미지가 위로 올라가게
        padding: 16,
        width: '100%',
    },
    image: {
        width: screenWidth * 0.35,
        height: screenWidth * 0.35,
        resizeMode: 'contain',
        marginRight: 0,
        marginBottom: 10, // ✅ 여기에 마진을 줘서 위로 띄움
    },
    speechBubble: {
        flex: 1,
        backgroundColor: '#F9FAEC',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    bubbleText: {
        fontSize: screenWidth < 350 ? 14 : 16,
        color: '#333',
        textAlign: 'center',
    },
});
