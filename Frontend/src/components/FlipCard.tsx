import React, { useEffect, useRef } from 'react';
import { Text, Pressable, View } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { cardStyles } from '../styles/FlipCardStyles';

// @ts-ignore
import flipSound from '../assets/sounds/flip-card.mp3';

interface Props {
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
    onPress: () => void;
}

const FlipCard = ({ symbol, isFlipped, isMatched, onPress }: Props) => {
    const rotation = useSharedValue(0);
    const flipSoundPlayer = useAudioPlayer(flipSound);
    flipSoundPlayer.volume = 0.3;

    useEffect(() => {
        if (isFlipped && !isMatched && flipSound.current) {
            flipSoundPlayer.play()
        }

        rotation.value = withTiming(isFlipped || isMatched ? 180 : 0, { duration: 300 });
    }, [isFlipped, isMatched]);

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }],
        opacity: interpolate(rotation.value, [0, 90], [0, 1]),
    }));

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }],
        opacity: interpolate(rotation.value, [0, 90], [1, 0]),
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
