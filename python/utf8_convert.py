import os
import chardet

def remove_bom(data: bytes) -> bytes:
    # UTF-8 BOM : b'\xef\xbb\xbf'
    if data.startswith(b'\xef\xbb\xbf'):
        return data[3:]
    return data

def convert_file_to_utf8(filepath):
    with open(filepath, "rb") as f:
        raw = f.read()

    # BOM 제거
    raw = remove_bom(raw)

    # 인코딩 감지
    detected = chardet.detect(raw)
    encoding = detected['encoding'] if detected['confidence'] > 0.6 else 'utf-8'

    # 디코딩 후 다시 utf-8 저장 (BOM 없이)
    try:
        text = raw.decode(encoding)
    except Exception as e:
        print(f"[Error decoding] {filepath}: {e}")
        return

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Converted: {filepath} ({encoding} -> utf-8 no BOM)")

def convert_all_in_folder(folder):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.lower().endswith('.csv'):
                full_path = os.path.join(root, file)
                convert_file_to_utf8(full_path)

if __name__ == "__main__":
    import sys
    folder = sys.argv[1] if len(sys.argv) > 1 else './csv'
    convert_all_in_folder(folder)