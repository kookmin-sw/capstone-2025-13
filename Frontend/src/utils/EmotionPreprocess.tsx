import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';

// dynamic range (float32 입력)용 전처리
export const imageToFloat32 = async (uri: string): Promise<Float32Array> => {
  try {
    const resized = await ImageResizer.createResizedImage(
      uri,
      64,
      64,
      'JPEG',
      100,
      90,
      undefined,
      false,
      { mode: 'stretch' }
    );

    const resizedPath = resized.path;
    const exists = await RNFS.exists(resizedPath);
    if (!exists) throw new Error('리사이즈된 이미지 파일이 존재하지 않습니다.');

    const base64 = await RNFS.readFile(resizedPath, 'base64');
    const buffer = Buffer.from(base64, 'base64');
    const raw = jpeg.decode(buffer, { useTArray: true });
    const { data, width, height } = raw;

    const floatArray = new Float32Array(1 * height * width * 3); // (1, 64, 64, 3)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = y * width + x;
        const bufferOffset = pixelIndex * 4;

        const r = data[bufferOffset] / 255.0;
        const g = data[bufferOffset + 1] / 255.0;
        const b = data[bufferOffset + 2] / 255.0;

        const targetOffset = (y * width + x) * 3;
        floatArray[targetOffset + 0] = r;
        floatArray[targetOffset + 1] = g;
        floatArray[targetOffset + 2] = b;
      }
    }

    return floatArray;
  } catch (err) {
    console.error('🧨 이미지 float32 전처리 실패:', err);
    return new Float32Array(1 * 64 * 64 * 3); // fallback
  }
};
