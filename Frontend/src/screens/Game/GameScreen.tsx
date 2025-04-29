import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button } from 'react-native';
import FlipCard from '../../components/FlipCard';
import { generateShuffledCards } from '../../utils/cardUtils';
import { gameScreenstyles } from "../../styles/GameScreenStyles";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "GameScreen">;

const GameScreen = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const [cards, setCards] = useState(generateShuffledCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const matchSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/success.mp3')
      );
      matchSound.current = sound;
      await matchSound.current.setVolumeAsync(0.3);
    };

    loadSound();

    return () => {
      if (matchSound.current) {
        matchSound.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
    setEndTime(null);
  }, [cards]);

  const handleFlip = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (cards[first].symbol === cards[second].symbol) {
          setMatched([...matched, first, second]);

          if (matchSound.current) {
            matchSound.current.replayAsync();
          }
        }
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && startTime !== null) {
      setEndTime(Date.now());
    }
  }, [matched]);

  const handleRestart = () => {
    setCards(generateShuffledCards());
    setFlipped([]);
    setMatched([]);
  };

  const isGameFinished = matched.length === cards.length;
  const timeTaken = endTime && startTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  return (
    <View style={gameScreenstyles.container}>
      <Text style={gameScreenstyles.title}>🃏 Card Matching Game 🃏</Text>

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

      {isGameFinished && (
        <View style={gameScreenstyles.result}>
          <Text style={gameScreenstyles.success}>🎉 You Win!</Text>
          {timeTaken && (
            <Text style={gameScreenstyles.timeTaken}>⏱️ 걸린 시간: {timeTaken}초</Text>
          )}
          <Button title="Play Again" onPress={handleRestart} />
          <View style={{ height: 10 }}></View>
          <Button title="End" onPress={() => {
            navigation.navigate('SimpleDiagnosis', {
              initialIndex: 33
            })
          }} />
        </View>
      )}
    </View>
  );
};

export default GameScreen;