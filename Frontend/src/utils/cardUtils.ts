export const generateShuffledCards = () => {
    const symbols = ['😀', '😂', '😍', '😎', '😢', '😡', '😱', '🥶']; // 8개!
    const cards = [...symbols, ...symbols] // 두 번 복제해서 짝을 맞춤
      .map((symbol, index) => ({
        id: index,
        symbol,
      }))
      .sort(() => Math.random() - 0.5); // 무작위 섞기
  
    return cards; // 총 16장 반환
  };
  