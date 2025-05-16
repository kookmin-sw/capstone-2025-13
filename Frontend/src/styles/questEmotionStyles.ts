import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, flexDirection: 'column' },

  half: {
    flex: 1,            // 위아래 절반씩
    overflow: 'hidden',
  },
  camera: {
    flex: 1,            // half 내부 꽉 채우기
  },

  bottom: {
    backgroundColor: '#000',  // 하단 배경
    padding: 8,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
