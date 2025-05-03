import { StyleSheet } from "react-native";
import fonts from '../constants/fonts';

const youtubePlaylistStyles = StyleSheet.create({
    container: {
        marginVertical: 20,
        alignItems: 'center',
        borderRadius: 12,
        padding: 10,
      },
      youtubeWrapper: {
        marginBottom: 20,
      },
      videoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a40',
        borderRadius: 12,
        marginBottom: 15,
        padding: 10,
      },
      thumbnail: {
        borderRadius: 8,
        marginRight: 10,
      },
      videoTextWrapper: {
        flexShrink: 1,
      },
      videoTitle: {
        color: '#fff',
        fontFamily: fonts.laundryBold,
        marginBottom: 2,
      },
      videoMeta: {
        color: '#ccc',
        fontFamily: fonts.laundry,
        fontSize: 12,
      },

});

export default youtubePlaylistStyles ;