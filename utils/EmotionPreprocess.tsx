import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

/**
 * 이미지를 48x48 사이즈로 리사이징하고, grayscale로 변환하여 모델 입력값으로 반환
 * @param uri 이미지 파일 경로
 * @returns Float32Array 배열 형태의 grayscale 이미지
 */
export const imageToGrayscale = async (uri: string): Promise<[Float32Array]> => {
  try {
    const resized = await ImageResizer.createResizedImage(
      uri,
      48,
      48,
      'PNG',
      100,
      0,
      undefined,
      false,
      { mode: 'contain' }
    );

    const base64 = await RNFS.readFile(resized.uri, 'base64');
    const binary = atob(base64);
    const pixelCount = 48 * 48;
    const grayscale = new Float32Array(pixelCount);

    for (let i = 0, j = 0; i < binary.length && j < pixelCount; i += 4, j++) {
      const r = binary.charCodeAt(i);
      const g = binary.charCodeAt(i + 1);
      const b = binary.charCodeAt(i + 2);
      grayscale[j] = (r + g + b) / 3 / 255;
    }

    return [grayscale];
  } catch (err) {
    console.error('이미지 전처리 실패:', err);
    return [new Float32Array(48 * 48)];
  }
};
