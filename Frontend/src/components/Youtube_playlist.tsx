import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import youtubePlaylistStyles from '../styles/youtubePlaylistStyles';

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

const Youtube_playlist = ({ title, videos, backgroundColor, width, mainVideo }: Props) => {
  return (
    <View style={[youtubePlaylistStyles.container, { backgroundColor }]}>

      {/* YouTube 플레이어 추가 */}
      <View style={[youtubePlaylistStyles.youtubeWrapper, { width: width * 0.9, height: width * 0.5 }]}>
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
          style={[youtubePlaylistStyles.videoCard, { width: width * 0.9, backgroundColor }]}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
        >
          <Image source={{ uri: video.thumbnail }} style={[youtubePlaylistStyles.thumbnail, { width: width * 0.25, height: width * 0.15 }]} />
          <View style={youtubePlaylistStyles.videoTextWrapper}>
            <Text numberOfLines={2} style={youtubePlaylistStyles.videoTitle}>{video.title}</Text>
            <Text style={youtubePlaylistStyles.videoMeta}>
              {video.channel} · {video.duration}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Youtube_playlist;
