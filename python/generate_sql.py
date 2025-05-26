import pandas as pd

def generate_insert_sql(df: pd.DataFrame, table_name: str = "help_center") -> str:
    """
    Generates SQL INSERT statements for a given DataFrame, ensuring only columns
    present in the `help_center` table structure are included. Handles PostGIS
    geometry(Point, 4326) for 'location' and formats time/timestamp columns.

    Args:
        df: The pandas DataFrame containing the data with English column names
            (assumed to be camelCase for some fields).
        table_name: The name of the target SQL table.

    Returns:
        A string containing the SQL TRUNCATE and INSERT statements.
    """

    # 한글->영어 컬럼명 매핑 때 이미 다 불린 상태라 가정 (df 컬럼명이 영어)
    column_mapping = {
        "hpCnterNm": "hp_cnter_nm",
        "hpCnterSe": "hp_cnter_se",
        "hpCnterJob": "hp_cnter_job",
        "operOpenHhmm": "oper_open_hhmm",
        "operColseHhmm": "oper_close_hhmm",
        "rstdeInfo": "rstde_info",
        "hpCnterAr": "hp_cnter_ar",
        "doctrCo": "doctr_co",
        "nurseCo": "nurse_co",
        "scrcsCo": "scrcs_co",
        "ntrstCo": "ntrst_co",
        "etcHnfSttus": "etc_hnf_sttus",
        "etcUseIfno": "etc_use_ifno",
        "operPhoneNumber": "oper_phone_number",
        "operInstitutionNm": "oper_institution_nm",
        "phoneNumber": "phone_number",
        "institutionNm": "institution_nm",
        "referenceDate": "reference_date",
        "instt_code": "instt_code",
        "instt_nm": "instt_nm",
        "rdnmadr": "rdnmadr",
        "lnmadr": "lnmadr",
    }

    # SQL 테이블에 실제 존재하는 컬럼 (location 포함, id 등 제외)
    sql_table_base_columns = {
        "hp_cnter_nm", "hp_cnter_se", "hp_cnter_job",
        "oper_open_hhmm", "oper_close_hhmm", "rstde_info",
        "hp_cnter_ar", "doctr_co", "nurse_co", "scrcs_co", "ntrst_co",
        "etc_hnf_sttus", "etc_use_ifno", "oper_phone_number", "oper_institution_nm",
        "phone_number", "institution_nm", "reference_date", "instt_code", "instt_nm",
        "rdnmadr", "lnmadr", "latitude", "longitude", "location"
    }

    time_cols_sql_name = {"oper_open_hhmm", "oper_close_hhmm"}
    timestamp_cols_sql_name = {"reference_date"}

    sql_statements = [
        f"TRUNCATE TABLE {table_name};",
        f"ALTER SEQUENCE {table_name}_id_seq RESTART WITH 1;"
    ]

    for idx, row in df.iterrows():
        columns_to_insert = ["created_at", "updated_at"]
        values_to_insert = ["NOW()", "NOW()"]

        added_columns_set = set(columns_to_insert)

        # 우선 latitude, longitude 값 가져오기
        lat = row.get("latitude", None)
        lon = row.get("longitude", None)

        for df_col_name, df_value in row.items():
            # latitude, longitude 제외 (별도 처리)
            if df_col_name in ["latitude", "longitude"]:
                continue

            # 매핑된 sql 컬럼명 얻기
            sql_col_name = column_mapping.get(df_col_name, df_col_name)

            # 테이블 컬럼에 없으면 skip
            if sql_col_name not in sql_table_base_columns:
                continue

            if sql_col_name in added_columns_set:
                continue

            # NULL 처리
            if pd.isna(df_value):
                columns_to_insert.append(sql_col_name)
                values_to_insert.append("NULL")
                added_columns_set.add(sql_col_name)
                continue

            # 시간형 컬럼(oper_open_hhmm, oper_close_hhmm) 처리 (HH:MM -> HH:MM:00)
            if sql_col_name in time_cols_sql_name:
                columns_to_insert.append(sql_col_name)
                values_to_insert.append(f"'{df_value}:00'")
                added_columns_set.add(sql_col_name)
                continue

            # 타임스탬프 컬럼(reference_date) 처리 (날짜 -> 날짜 00:00:00)
            if sql_col_name in timestamp_cols_sql_name:
                columns_to_insert.append(sql_col_name)
                values_to_insert.append(f"'{df_value} 00:00:00'")
                added_columns_set.add(sql_col_name)
                continue

            # 문자열 컬럼 (따옴표 이스케이프)
            if isinstance(df_value, str):
                safe_value = df_value.replace("'", "''")
                columns_to_insert.append(sql_col_name)
                values_to_insert.append(f"'{safe_value}'")
                added_columns_set.add(sql_col_name)
                continue

            # 숫자, 기타 타입
            columns_to_insert.append(sql_col_name)
            values_to_insert.append(str(df_value))
            added_columns_set.add(sql_col_name)

        # latitude 및 longitude 컬럼 추가 (값이 있으면 숫자, 없으면 NULL)
        if pd.notna(lat):
            columns_to_insert.append("latitude")
            values_to_insert.append(str(lat))
            added_columns_set.add("latitude")
        else:
            columns_to_insert.append("latitude")
            values_to_insert.append("NULL")
            added_columns_set.add("latitude")

        if pd.notna(lon):
            columns_to_insert.append("longitude")
            values_to_insert.append(str(lon))
            added_columns_set.add("longitude")
        else:
            columns_to_insert.append("longitude")
            values_to_insert.append("NULL")
            added_columns_set.add("longitude")

        # location 컬럼 생성: lat, lon 모두 있을 때만 st_point 생성, 아니면 NULL
        if pd.notna(lat) and pd.notna(lon):
            columns_to_insert.append("location")
            values_to_insert.append(f"ST_SetSRID(ST_MakePoint({lon}, {lat}), 4326)")
        else:
            columns_to_insert.append("location")
            values_to_insert.append("NULL")

        insert_stmt = (
            f"INSERT INTO {table_name} "
            f"({', '.join(columns_to_insert)}) VALUES ({', '.join(values_to_insert)});"
        )
        sql_statements.append(insert_stmt)

    return "\n".join(sql_statements)


if __name__ == "__main__":
    # 예시: merged.csv 를 불러와 SQL 생성 후 output.sql 저장
    df = pd.read_csv("merged.csv")
    sql_output = generate_insert_sql(df)
    with open("output.sql", "w", encoding="utf-8") as f:
        f.write(sql_output)
    print("SQL statements have been saved to output.sql")