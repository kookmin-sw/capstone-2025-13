import React, { useEffect } from 'react';
import { Text, Pressable, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { cardStyles } from '../styles/FlipCardStyles';
interface Props {
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
    onPress: () => void;
}

const FlipCard = ({ symbol, isFlipped, isMatched, onPress }: Props) => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withTiming(isFlipped || isMatched ? 180 : 0, { duration: 300 });
    }, [isFlipped, isMatched]);

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }], // 카드 회전
        opacity: interpolate(rotation.value, [0, 90], [0, 1]), // 앞면의 투명도 조정
    }));

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }], // 카드 회전
        opacity: interpolate(rotation.value, [0, 90], [1, 0]), // 뒷면의 투명도 조정
    }));

    return (
        <Pressable onPress={onPress} disabled={isFlipped || isMatched}>
            <View style={cardStyles.cardContainer}>
                <Animated.View style={[cardStyles.card, cardStyles.back, backAnimatedStyle]}>
                    <Text style={cardStyles.text}>🍀</Text>
                </Animated.View>
                <Animated.View style={[cardStyles.card, cardStyles.front, frontAnimatedStyle]}>
                    <Text style={cardStyles.text}>{symbol}</Text>
                </Animated.View>
            </View>
        </Pressable>
    );
};


export default FlipCard;
