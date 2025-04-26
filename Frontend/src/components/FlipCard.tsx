import React, { useEffect, useRef } from 'react';
import { Text, Pressable, View } from 'react-native';
import { Audio } from 'expo-av';
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
    const flipSound = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        // 컴포넌트가 처음 마운트 될 때만 사운드 로드
        const loadSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sounds/flip-card.mp3')
            );
            flipSound.current = sound;
            await flipSound.current.setVolumeAsync(0.3);
        };

        loadSound();

        // 컴포넌트가 사라질 때 사운드 정리
        return () => {
            if (flipSound.current) {
                flipSound.current.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {

        const playSound = async () => {
            if (isFlipped && !isMatched && flipSound.current) {
                await flipSound.current.replayAsync();
            }
        };

        playSound();

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
