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

        // Extract rotation degrees passed from JS
        val rotation = (arguments?.get("rotation") as? Double)?.toInt() ?: 0

        // Convert YUV to RGBA byte array
        val rgba = YuvToRgbaConverter.convert(image)

        // Prepare direct ByteBuffer for native
        val rgbaBuffer = ByteBuffer.allocateDirect(rgba.size).apply {
            put(rgba)
            rewind()
        }

        // Call native preprocessor with rotation parameter
        val floatArray = cropResizeNormalizeDirect(
            rgbaBuffer,
            width,
            height,
            x, y, w, h,
            rotation
        )

        // Convert native FloatArray to JS-friendly Double list
        return floatArray.map { it.toDouble() }
    }
}