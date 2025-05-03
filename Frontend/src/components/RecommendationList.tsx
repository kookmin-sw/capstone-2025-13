import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import fonts from '../constants/fonts';

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

interface Props {
  title: string;
  videos: VideoItem[];
  backgroundColor: string;
  width: number;  // 추가: width를 prop으로 전달
  mainVideo: { id: string; title: string };  // 추가: mainVideo prop
}

const RecommendationList = ({ title, videos, backgroundColor, width, mainVideo }: Props) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>

      {/* YouTube 플레이어 추가 */}
      <View style={[styles.youtubeWrapper, { width: width * 0.9, height: width * 0.5 }]}>
        <YoutubePlayer
          height={width * 0.5}
          width={width * 0.9}
          videoId={mainVideo.id}
          play={false}
        />
      </View>

      {videos.map((video) => (
        <TouchableOpacity
          key={video.id}
          style={[styles.videoCard, { width: width * 0.9, backgroundColor }]}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
        >
          <Image source={{ uri: video.thumbnail }} style={[styles.thumbnail, { width: width * 0.25, height: width * 0.15 }]} />
          <View style={styles.videoTextWrapper}>
            <Text numberOfLines={2} style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoMeta}>
              {video.channel} · {video.duration}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default RecommendationList;
