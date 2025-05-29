package space.mori.wooong

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import java.nio.ByteBuffer
import android.media.Image

class FaceDetectorFrameProcessorPlugin(
    proxy: VisionCameraProxy,
    options: Map<String, Any>?
) : FrameProcessorPlugin() {

    companion object {
        init {
            System.loadLibrary("face-preprocessing-native")
        }
        @JvmStatic
        external fun cropResizeNormalizeDirect(
            buffer: ByteBuffer,
            width: Int,
            height: Int,
            x: Int, y: Int, w: Int, h: Int,
            rotation: Int
        ): FloatArray
    }

    private object RgbaBufferPool {
        private var buffer: ByteBuffer? = null
        private var capacity: Int = 0

        @Synchronized
        fun get(size: Int): ByteBuffer {
            if (buffer == null || capacity < size) {
                buffer = ByteBuffer.allocateDirect(size)
                capacity = size
            }
            buffer!!.clear()
            return buffer!!
        }

        @Synchronized
        fun recycle(buf: ByteBuffer) {
            // 현재는 단일 버퍼만 유지, 필요 시 구현 확장 가능
        }
    }

    override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
        // Get raw image from frame
        val image: Image = frame.getImage()
        val width = image.width
        val height = image.height

        // Extract bounding box parameters
        val x = (arguments?.get("x") as Double).toInt()
        val y = (arguments?.get("y") as Double).toInt()
        val w = (arguments?.get("w") as Double).toInt()
        val h = (arguments?.get("h") as Double).toInt()
        val rotation = (arguments?.get("rotation") as? Double)?.toInt() ?: 0

        return try {
            val rgba = YuvToRgbaConverter.convert(image)
            val rgbaBuffer = RgbaBufferPool.get(rgba.size).apply {
                put(rgba)
                rewind()
            }

            // ✅ FloatArray 그대로 반환 (JS로 그대로 전달)
            cropResizeNormalizeDirect(
                rgbaBuffer,
                width, height,
                x, y, w, h,
                rotation
            ).map { it.toDouble() }
            
        } finally {
            image.close() // ✅ 메모리 누수 방지
        }
    }
}