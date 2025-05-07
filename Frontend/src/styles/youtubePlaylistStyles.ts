import { StyleSheet, Dimensions } from "react-native";
import fonts from '../constants/fonts';

const { width } = Dimensions.get('window');

const youtubePlaylistStyles = StyleSheet.create({
  container: {
    marginVertical: width * 0.05,
    alignItems: 'center',
    borderRadius: width * 0.03,
    padding: width * 0.025,
  },
  youtubeWrapper: {
    marginBottom: width * 0.05,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a40',
    borderRadius: width * 0.03,
    marginBottom: width * 0.04,
    padding: width * 0.025,
  },
  thumbnail: {
    width: width * 0.25,
    height: width * 0.15,
    borderRadius: width * 0.02,
    marginRight: width * 0.025,
  },
  videoTextWrapper: {
    flexShrink: 1,
  },
  videoTitle: {
    color: '#fff',
    fontFamily: fonts.laundryBold,
    fontSize: width * 0.035, // 반응형 폰트
    marginBottom: width * 0.01,
  },
  videoMeta: {
    color: '#ccc',
    fontFamily: fonts.laundry,
    fontSize: width * 0.025, // 반응형 폰트
  },
});

export default youtubePlaylistStyles;
