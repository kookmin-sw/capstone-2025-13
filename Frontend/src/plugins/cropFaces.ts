import { VisionCameraProxy, Frame } from 'react-native-vision-camera'

// 이 이름은 Native 쪽에서 등록한 이름과 반드시 일치해야 합니다.
const plugin = VisionCameraProxy.initFrameProcessorPlugin("cropFaces", {})

export type Bounds = { x: number; y: number; width: number; height: number }

/**
 * Scans faces via your native Frame Processor Plugin.
 * @param frame - VisionCamera Frame object
 * @returns face data object (whatever your native code returns)
 */
export function cropFaces(frame: Frame, bounds: Bounds) {
  'worklet'
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin "detectFaces"!')
  }
  // plugin.call(frame, …args) 의 순서는 native callback 의 파라미터 순서와 동일해야 합니다
  const result = plugin.call(frame, bounds)
  if (!result) {
    throw new Error('cropFaces plugin returned undefined')
  }
  return result
}