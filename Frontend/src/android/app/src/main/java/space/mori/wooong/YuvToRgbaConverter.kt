package space.mori.wooong

import android.media.Image

object YuvToRgbaConverter {
    fun convert(image: Image): ByteArray {
        val width = image.width
        val height = image.height

        val yBuffer = image.planes[0].buffer
        val uBuffer = image.planes[1].buffer
        val vBuffer = image.planes[2].buffer

        val yRowStride = image.planes[0].rowStride
        val uvRowStride = image.planes[1].rowStride
        val uvPixelStride = image.planes[1].pixelStride

        val rgba = ByteArray(width * height * 4)

        for (j in 0 until height) {
            for (i in 0 until width) {
                val yIndex = j * yRowStride + i
                val uvIndex = (j shr 1) * uvRowStride + (i shr 1) * uvPixelStride

                val y = (yBuffer.get(yIndex).toInt() and 0xFF)
                val u = (uBuffer.get(uvIndex).toInt() and 0xFF) - 128
                val v = (vBuffer.get(uvIndex).toInt() and 0xFF) - 128

                val r = (y + 1.370705f * v).toInt().coerceIn(0, 255)
                val g = (y - 0.337633f * u - 0.698001f * v).toInt().coerceIn(0, 255)
                val b = (y + 1.732446f * u).toInt().coerceIn(0, 255)

                val index = (j * width + i) * 4
                rgba[index] = r.toByte()
                rgba[index + 1] = g.toByte()
                rgba[index + 2] = b.toByte()
                rgba[index + 3] = 0xFF.toByte()
            }
        }

        return rgba
    }
}
