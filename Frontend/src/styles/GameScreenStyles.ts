import { StyleSheet } from "react-native";

export const gameScreenstyles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 50 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 50, marginTop:30 },
    gridContainer: { flex: 1,  alignItems: 'center' },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 320,
    },
    result: { marginBottom: 70},
    success: { fontSize: 22, color: 'green', marginBottom: 10 },
  });