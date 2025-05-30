import AVFoundation
import Accelerate
import CoreVideo
import VisionCamera

// 상수들은 클래스 내부 정적 멤버로 정의합니다.
@objc(CropFacesFrameProcessorPlugin)
public class CropFacesFrameProcessorPlugin: FrameProcessorPlugin {
    private static let TARGET_SIZE = 64
    private static let CHANNELS = 3 // R, G, B
    private static let BGRA_BYTES_PER_PIXEL = 4 // iOS CVPixelBuffer 기본 BGRA
    private static let OUTPUT_SIZE = TARGET_SIZE * TARGET_SIZE * CHANNELS
    private static var staticOutput: [Double]? = nil
    private static var isInitialized = false
    private static let PIXEL_MAX: Float = 255.0

    public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
        super.init(proxy: proxy, options: options)
        Self.initializeStaticMemory()
        print("CropFacesFrameProcessorPlugin: Plugin initialized.")
    }

    private static func initializeStaticMemory() {
        if !isInitialized {
            staticOutput = Array(repeating: 0.0, count: OUTPUT_SIZE)
            isInitialized = true
        }
    }

    private static func cleanupStaticMemory() {
        if isInitialized {
            staticOutput = nil
            isInitialized = false
        }
    }

    private static func getEmptyDoubleArray() -> [Double]? {
        if !isInitialized { return nil }
        return staticOutput
    }

    public override func callback(
        _ frame: Frame, // 외부 이름 생략
        withArguments arguments: [AnyHashable: Any]?
    ) -> Any? {
        // 1. pixelBuffer 안전하게 가져오기
        let sampleBuffer = frame.buffer
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            print("CropFacesFrameProcessorPlugin: Failed to get CVPixelBuffer from frame.buffer.")
            return nil
        }

        // 2. arguments에서 crop 좌표 및 크기 파싱
        let cropX = arguments?["x"] as? Int ?? 0
        let cropY = arguments?["y"] as? Int ?? 0
        let cropWidth = arguments?["w"] as? Int ?? CropFacesFrameProcessorPlugin.TARGET_SIZE
        let cropHeight = arguments?["h"] as? Int ?? CropFacesFrameProcessorPlugin.TARGET_SIZE

        // 3. CVPixelBuffer 잠금하고 정보 얻기
        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }

        let srcWidth = CVPixelBufferGetWidth(pixelBuffer)
        let srcHeight = CVPixelBufferGetHeight(pixelBuffer)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)

        guard let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer) else {
            print("CropFacesFrameProcessorPlugin: Failed to get base address of pixelBuffer.")
            return nil
        }

        let srcPointer = baseAddress.bindMemory(to: UInt8.self, capacity: bytesPerRow * srcHeight)

        var normalizedPixels = [Float]()
        normalizedPixels.reserveCapacity(CropFacesFrameProcessorPlugin.TARGET_SIZE * CropFacesFrameProcessorPlugin.TARGET_SIZE * CropFacesFrameProcessorPlugin.CHANNELS)

        for targetY in 0..<CropFacesFrameProcessorPlugin.TARGET_SIZE {
            for targetX in 0..<CropFacesFrameProcessorPlugin.TARGET_SIZE {
                // crop 영역 내에서 픽셀 좌표 계산 (nearest neighbor 샘플링)
                let srcX = cropX + (targetX * cropWidth) / CropFacesFrameProcessorPlugin.TARGET_SIZE
                let srcY = cropY + (targetY * cropHeight) / CropFacesFrameProcessorPlugin.TARGET_SIZE

                // bounds 체크
                if srcX < 0 || srcX >= srcWidth || srcY < 0 || srcY >= srcHeight {
                    // 영역 벗어나면 검정색 픽셀 반환
                    normalizedPixels.append(contentsOf: [0.0, 0.0, 0.0])
                } else {
                    // BGRA 포맷 기반 오프셋 계산
                    let pixelOffset = srcY * bytesPerRow + srcX * CropFacesFrameProcessorPlugin.BGRA_BYTES_PER_PIXEL
                    normalizedPixels.append(contentsOf: Self.normalizePixelStatic(from: srcPointer, offset: pixelOffset))
                }
            }
        }
        return normalizedPixels
    }

    private static func normalizePixelStatic(from ptr: UnsafePointer<UInt8>, offset: Int) -> [Float] {
        // BGRA order: ptr[offset+0] = B, +1 = G, +2 = R, +3 = A (Alpha)
        let b = Float(ptr[offset + 0]) / PIXEL_MAX
        let g = Float(ptr[offset + 1]) / PIXEL_MAX
        let r = Float(ptr[offset + 2]) / PIXEL_MAX
        // Alpha는 사용하지 않음
        return [r, g, b]
    }
}
