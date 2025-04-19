import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import FlipCard from '../../components/FlipCard';
import { generateShuffledCards } from '../../utils/cardUtils';
import { gameScreenstyles } from "../../styles/GameScreenStyles";
const GameScreen = () => {
  const [cards, setCards] = useState(generateShuffledCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleFlip = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index)) {
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (cards[first].symbol === cards[second].symbol) {
          setMatched([...matched, first, second]);
        }
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const handleRestart = () => {
    setCards(generateShuffledCards());
    setFlipped([]);
    setMatched([]);
  };

  const isGameFinished = matched.length === cards.length;

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
          <Button title="Play Again" onPress={handleRestart} />
        </View>
      )}
    </View>
  );
};


export default GameScreen;
