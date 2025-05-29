import { VisionCameraProxy, Frame } from "react-native-vision-camera"

const plugin = VisionCameraProxy.initFrameProcessorPlugin("cropFaces", {})

export type Bounds = { x: number; y: number; width: number; height: number; }

// 워크릿으로 선언된 매핑 함수
const orientationToDegrees = (orientation: 
    "portrait" | "portrait-upside-down" | "landscape-left" | "landscape-right"
): 0 | 90 | 180 | 270 => {
  'worklet'
  switch (orientation) {
    case "portrait":             return 0
    case "landscape-left":       return 90
    case "portrait-upside-down": return 180
    case "landscape-right":      return 270
  }
}

export function cropFaces(frame: Frame, bounds: Bounds) {
  'worklet'
  if (!plugin) throw new Error('Failed to load Frame Processor Plugin "cropFaces"!')

  // 워크릿 컨텍스트에서 orientation 읽고 매핑
  const ori = (frame as any).orientation as 
    "portrait"|"portrait-upside-down"|"landscape-left"|"landscape-right"
  const rotation = orientationToDegrees(ori)
  const result = plugin.call(frame, {
    width:    frame.width,
    height:   frame.height,
    x:        bounds.x  | 0,
    y:        bounds.y  | 0,
    w:        bounds.width  | 0,
    h:        bounds.height | 0,
    rotation, 
  })
  if (!result) throw new Error('cropFaces plugin returned undefined')
  return result as number[]
}
