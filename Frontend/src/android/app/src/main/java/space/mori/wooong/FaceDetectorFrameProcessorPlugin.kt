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
            x: Int, y: Int, w: Int, h: Int
        ): FloatArray
    }

    override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
        val image: Image = frame.getImage()
        val width = image.width
        val height = image.height

        val x = (arguments?.get("x") as Double).toInt()
        val y = (arguments?.get("y") as Double).toInt()
        val w = (arguments?.get("width") as Double).toInt()
        val h = (arguments?.get("height") as Double).toInt()

        val rgba = YuvToRgbaConverter.convert(image)

        val rgbaBuffer = ByteBuffer.allocateDirect(rgba.size)
        rgbaBuffer.put(rgba)
        rgbaBuffer.rewind()

        val floatArray = cropResizeNormalizeDirect(
            rgbaBuffer,
            width,
            height,
            x, y, w, h
        )
        return floatArray.map { it.toDouble() }
    }
}
