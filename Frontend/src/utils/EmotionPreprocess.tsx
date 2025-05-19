import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

// 전체 이미지를 48x48로 리사이즈 후, 실제 픽셀 데이터를 디코딩해 그레이스케일 Float32Array로 반환
export const imageToGrayscale = async (uri: string): Promise<[Float32Array]> => {
  try {
    // 1) 이미지 리사이즈
    const resized = await ImageResizer.createResizedImage(
      uri,
      64,
      64,
      'JPEG',
      100,
      270,
      undefined,
      false,
      { mode: 'stretch' }
    );

    // 2) 파일 존재 여부 확인
    const resizedPath = resized.path;
    const exists = await RNFS.exists(resizedPath);
    if (!exists) throw new Error('리사이즈된 이미지 파일이 존재하지 않습니다.');

    // 3) 파일을 base64로 읽고, 버퍼 생성
    const base64 = await RNFS.readFile(resizedPath, 'base64');
    const buffer = Buffer.from(base64, 'base64');

    // 4) JPEG 파일 디코딩 -> 실제 RGBA 픽셀 배열 획득
    const raw = jpeg.decode(buffer, { useTArray: true });
    const { data, width, height } = raw; // data: Uint8Array of RGBA

    // 5) 그레이스케일 변환
    const pixelCount = width * height;
    const grayscale = new Float32Array(pixelCount);
    for (let i = 0; i < pixelCount; i++) {
      const offset = i * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      grayscale[i] = (r + g + b) / 3 / 255;
    }

    return [grayscale];
  } catch (err) {
    console.error('🧨 이미지 전처리 실패:', err);
    // 실패 시, 모두 0으로 채운 배열 반환
    return [new Float32Array(64 * 64)];
  }
};
