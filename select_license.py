import os

def read_license_files(directory):
    license_content = ""
    
    # Walk through the directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file == "LICENSE":
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    license_content += f.read() + "\n\n"
                    
    return license_content

# Usage example
directory_path = "C:\\Users\\user02\\Documents\\my_app_e"
combined_license_content = read_license_files(directory_path)
def write_to_file(file_path, text):
    # 'w'モードでファイルを開く（ファイルが存在しない場合は新しく作成される）
    with open(file_path, 'w',encoding='utf-8') as file:
        file.write(text)  # 文字列をファイルに書き込む
file_path = 'C:\\Users\\user02\\Documents\\warrrr.txt'

# 関数を呼び出してファイルに書き込む
write_to_file(file_path,combined_license_content)