cmake_minimum_required(VERSION 3.4.1)

add_library(
    face-preprocessing-native
    SHARED
    plugins/FacePreprocessingNative.cpp
)

find_library(log-lib log)

target_link_libraries(
    face-preprocessing-native
    ${log-lib}
)
