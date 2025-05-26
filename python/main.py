import os
import pandas as pd

# 한글->영어 컬럼명 매핑 딕셔너리
col_map = {
    "건강증진센터명": "hpCnterNm",
    "건강증진센터구분": "hpCnterSe",
    "소재지도로명주소": "rdnmadr",
    "소재지지번주소": "lnmadr",
    "위도": "latitude",
    "경도": "longitude",
    "건강증진업무내용": "hpCnterJob",
    "운영시작시각": "operOpenHhmm",
    "운영종료시각": "operColseHhmm",
    "휴무일정보": "rstdeInfo",
    "건물면적": "hpCnterAr",
    "의사수": "doctrCo",
    "간호사수": "nurseCo",
    "사회복지사수": "scrcsCo",
    "영양사수": "ntrstCo",
    "기타인력현황": "etcHnfSttus",
    "기타이용안내": "etcUseIfno",
    "운영기관전화번호": "operPhoneNumber",
    "운영기관명": "operInstitutionNm",
    "관리기관전화번호": "phoneNumber",
    "관리기관명": "institutionNm",
    "데이터기준일자": "referenceDate",
    "제공기관코드": "instt_code",
    "제공기관기관명": "instt_nm"
}

# csv 폴더 내 모든 csv 파일 목록
csv_dir = './csv'
all_files = [os.path.join(csv_dir, f) for f in os.listdir(csv_dir) if f.endswith('.csv')]

dfs = []
for file in all_files:
    print(f"file: ${file}")
    df = pd.read_csv(file)
    # 컬럼명 변경 (한글->영어)
    # 존재하면 바꾸고 없으면 그냥 두기
    new_columns = []
    for col in df.columns:
        new_col = col_map.get(col, col)
        new_columns.append(new_col)
    df.columns = new_columns
    dfs.append(df)

# 모든 데이터프레임 합치기
merged_df = pd.concat(dfs, ignore_index=True)

# 결과 저장
merged_df.to_csv('merged.csv', index=False)
print(f"병합 완료: merged.csv 생성됨")