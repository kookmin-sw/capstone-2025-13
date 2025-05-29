#include <jni.h>
#include <vector>

extern "C"
JNIEXPORT jfloatArray JNICALL
Java_space_mori_wooong_FaceDetectorFrameProcessorPlugin_cropResizeNormalizeDirect(
    JNIEnv* env,
    jobject /* this */,
    jobject byteBuffer,   // RGBA ByteBuffer
    jint imageWidth,
    jint imageHeight,
    jint x,    // portrait-box.x
    jint y,    // portrait-box.y
    jint w,    // portrait-box.width
    jint h     // portrait-box.height
) {
    auto* rgba = reinterpret_cast<uint8_t*>(env->GetDirectBufferAddress(byteBuffer));
    if (!rgba) return nullptr;

    // 1) portrait → landscape 회전 보정: (x,y,w,h) 축 교환
    int boxX = imageWidth-y-h;
    int boxY = x;
    int boxW = h;  // portrait height → landscape width
    int boxH = w;  // portrait width  → landscape height

    std::vector<float> output;
    output.reserve(64 * 64 * 3);

    for (int xx = 0; xx < 64; ++xx) {
      for (int yy = 0; yy < 64; ++yy) {
            // 2) 올바른 매핑: (xx→가로), (yy→세로)
            int srcX = boxX + boxW - (boxW / 64 * xx) -2;
            int srcY = boxY + (boxH / 64 * yy);

            // 3) 범위 벗어나지 않게
            srcX = std::clamp(srcX, 0, imageWidth  - 1);
            srcY = std::clamp(srcY, 0, imageHeight - 1);

            // 4) stride는 imageWidth
            int idx = (srcY * imageWidth + srcX) * 4;

            output.push_back(rgba[idx    ] / 255.0f);  // R
            output.push_back(rgba[idx + 1] / 255.0f);  // G
            output.push_back(rgba[idx + 2] / 255.0f);  // B
        }
    }

    jfloatArray result = env->NewFloatArray(output.size());
    env->SetFloatArrayRegion(result, 0, output.size(), output.data());
    return result;
}