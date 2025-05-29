import { Dimensions, StyleSheet } from 'react-native';
 const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
 
  container: { flex: 1, flexDirection: 'column' },
   half: {
    overflow: 'hidden',
  },
  top70: {
    flex: 7,
  },
  bottom30: {
    flex: 3,
  },

  camera: {
    flex: 1,
  },

  bottom: {
    backgroundColor: '',  // 필요 시 배경 색 채우기
    padding: 8,
  },
  
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    overlay: {
    position: 'absolute',     
    bottom: 0,                
    left: 0,
    right: 0,
    height: '30%',            
    backgroundColor: 'rgba(255,255,255,0.9)',  
    zIndex: 10,             
  },
  //   faceGuide: {
  //   // position: 'absolute',
  //   // // 중앙 정렬
  //   // left: (width - 150) / 2,
  //   // top: ((height * 7/10) - 200) / 2,  // 카메라 영역 높이 = 화면 높이 * 7/10
  //   // width: 300,
  //   // height: 400,
  //   borderWidth: 2,
  //   borderColor: '#FF9B4B',
  //   borderRadius: 100,        // 150/2 이상이면 세로도 타원 형태
  //   borderStyle: 'dashed',    // 점선
  //   zIndex: 50,
  // },

  warningText: {
  color: '#D32F2F',
  fontSize: 16,
  fontWeight: '600',
},
modalContent: {
  maxWidth: "90%",
  backgroundColor: "#fff",
  borderRadius: 20,
  paddingVertical: 20,
  paddingHorizontal: 24,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
  position: "absolute",
  top: "40%",  // 화면 위쪽에서 30% 위치
},
backButtonWrapper: {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-start",
},
});
