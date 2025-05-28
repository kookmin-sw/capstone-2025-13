import React, { useEffect, useRef } from 'react';
import { Text, Pressable, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { cardStyles } from '../../styles/Game/FlipCardStyles';

interface Props {
    symbol: string;
    isFlipped: boolean;
    isMatched: boolean;
    onPress: () => void;
}

const FlipCard = ({ symbol, isFlipped, isMatched, onPress }: Props) => {
    const flipSoundFile = require('../../assets/sounds/flip-card.mp3');

    const rotation = useSharedValue(0);

    // 사운드 참조용 ref
    const flipSound = useRef<Audio.Sound | null>(null);

    // 사운드 로드 및 언로드 관리
    useEffect(() => {
        let isMounted = true;
        const loadSound = async () => {
            try {
                const { sound } = await Audio.Sound.createAsync(flipSoundFile);
                if (isMounted) {
                    flipSound.current = sound;
                    await flipSound.current.setVolumeAsync(0.3);
                }
            } catch (error) {
                console.error('Failed to load flip sound', error);
            }
        };
        loadSound();

        return () => {
            isMounted = false;
            if (flipSound.current) {
                flipSound.current.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        rotation.value = withTiming(isFlipped || isMatched ? 180 : 0, { duration: 300 });

        // 카드가 뒤집힐 때 소리 재생 (isFlipped가 true로 변할 때만)
        if (isFlipped && !isMatched) {
            if (flipSound.current) {
                flipSound.current.replayAsync().catch((e) => {
                    console.error('Failed to play flip sound', e);
                });
            }
        }
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
