cmake_minimum_required(VERSION 3.10)

# 프로젝트 이름 (임의 지정 가능)
project(face_preprocessing_native)

# 네이티브 라이브러리 추가
add_library(
    face-preprocessing-native            # .so 파일 이름: libface-detector-native.so
    SHARED
    plugins/FacePreprocessingNative.cpp  # 위에서 만든 C++ 소스 파일명
)

# Android 로그 라이브러리 찾기
find_library(
    log-lib
    log
)

# 헤더나 다른 include가 필요하다면 추가
# target_include_directories(face-detector-native PRIVATE ${CMAKE_SOURCE_DIR})

# 링크할 라이브러리 지정
target_link_libraries(
    face-preprocessing-native
    ${log-lib}
)
