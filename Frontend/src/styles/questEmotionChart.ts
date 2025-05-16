import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    width: 280,          // 필요에 따라 조절
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  list: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
  },
  barWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF9B4B',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
