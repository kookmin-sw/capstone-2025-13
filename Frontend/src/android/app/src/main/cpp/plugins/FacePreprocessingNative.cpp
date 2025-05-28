#include <jni.h>
#include <vector>

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_space_mori_wooong_FaceDetectorProcessingNative_cropResizeNormalizeDirect(
    JNIEnv* env,
    jobject /* this */,
    jobject byteBuffer,   // DirectByteBuffer
    jint imageWidth,
    jint imageHeight,
    jint x,
    jint y,
    jint w,
    jint h
) {
    // 1) ByteBuffer → native pointer
    uint8_t* rgba = reinterpret_cast<uint8_t*>(env->GetDirectBufferAddress(byteBuffer));
    if (!rgba) return nullptr;
    const int imageSize = imageWidth * imageHeight * 4;

    // 2) 얼굴 영역
    struct Bounds { int x, y, w, h; } faceBox = { x, y, w, h };

    // 3) 결과 버퍼 준비
    std::vector<float> output;
    output.reserve(64 * 64 * 3);

    // 4) Crop → Resize(64x64) → Normalize
    for (int yy = 0; yy < 64; ++yy) {
        for (int xx = 0; xx < 64; ++xx) {
            int srcX = faceBox.x + (xx * faceBox.w) / 64;
            int srcY = faceBox.y + (yy * faceBox.h) / 64;
            int idx  = (srcY * imageWidth + srcX) * 4;
            if (idx + 2 >= imageSize) continue;
            output.push_back(rgba[idx]   / 255.0f);
            output.push_back(rgba[idx+1] / 255.0f);
            output.push_back(rgba[idx+2] / 255.0f);
        }
    }

    // 5) std::vector → jfloatArray
    jfloatArray result = env->NewFloatArray(output.size());
    env->SetFloatArrayRegion(result, 0, output.size(), output.data());
    return result;
}
