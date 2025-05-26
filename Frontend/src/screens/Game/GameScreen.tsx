import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FlipCard from '../../components/Game/FlipCard';
import { generateShuffledCards } from '../../utils/cardUtils';
import { gameScreenstyles } from "../../styles/Game/GameScreenStyles";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "GameScreen">;

const GameScreen = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'GameScreen'>>();
  const score = route.params?.score ?? 0;

  const [cards, setCards] = useState(generateShuffledCards());
  const [showModal, setShowModal] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const matchSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // 게임 시작할 때 사운드 로드
    loadMatchSound();
    setStartTime(Date.now());
    setEndTime(null);

    return () => {
      // 컴포넌트 언마운트 시 사운드 해제
      if (matchSound.current) {
        matchSound.current.unloadAsync();
      }
    };
  }, [cards]);

  const loadMatchSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/success.mp3')
      );
      matchSound.current = sound;
      matchSound.current.setVolumeAsync(0.3);
    } catch (error) {
      console.error('Failed to load sound', error);
    }
  };

  const playMatchSound = async () => {
    try {
      if (matchSound.current) {
        await matchSound.current.replayAsync();
      }
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  };

  const handleFlip = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (cards[first].symbol === cards[second].symbol) {
          setMatched([...matched, first, second]);
          playMatchSound();
        }
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && startTime !== null) {
      setEndTime(Date.now());
      setShowModal(true);
    }
  }, [matched]);

  const handleRestart = () => {
    setCards(generateShuffledCards());
    setFlipped([]);
    setMatched([]);
    setShowModal(false);
  };

  const isGameFinished = matched.length === cards.length;
  const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  return (
    <View style={gameScreenstyles.container}>
      <Text style={gameScreenstyles.title}>표정 맞추기 게임</Text>

      <View style={gameScreenstyles.gridContainer}>
        <View style={gameScreenstyles.grid}>
          {cards.map((card, index) => (
            <FlipCard
              key={index}
              symbol={card.symbol}
              isFlipped={flipped.includes(index)}
              isMatched={matched.includes(index)}
              onPress={() => handleFlip(index)}
            />
          ))}
        </View>
      </View>

      {isGameFinished && showModal && (
        <View style={[gameScreenstyles.modalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
          <View style={gameScreenstyles.modalContent}>
            <Text style={gameScreenstyles.success}>🎉 성공! 🎉</Text>
            <Text style={gameScreenstyles.timeTaken}>⏱️ 걸린 시간: {timeTaken}초</Text>
            <View style={gameScreenstyles.row}>
              <TouchableOpacity style={gameScreenstyles.againButton} onPress={handleRestart}>
                <Text style={gameScreenstyles.againText}>한 번 더!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={gameScreenstyles.endButton}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate('SimpleDiagnosis', {
                    initialIndex: 33,
                    score: score,
                  });
                }}
              >
                <Text style={gameScreenstyles.endText}>끝낼래</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default GameScreen;
