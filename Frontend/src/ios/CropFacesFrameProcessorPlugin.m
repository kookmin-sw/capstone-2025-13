#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>
#import "wooong-Swift.h" // YOUR_XCODE_PROJECT_NAME을 실제 프로젝트 이름으로 대체

// "cropFaces"라는 이름으로 플러그인 등록
VISION_EXPORT_SWIFT_FRAME_PROCESSOR(CropFacesFrameProcessorPlugin, cropFaces)
