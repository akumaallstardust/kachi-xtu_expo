from PIL import Image

def crop_image(image_path, output_path, n):
    # 画像を開く
    image = Image.open(image_path)
    
    # 画像のサイズを取得
    width, height = image.size
    
    # 左右の端を削る幅を計算
    crop_width = int(width * n / 100)
    
    # 新しいサイズを計算
    new_width = width - 2 * crop_width
    
    # 画像をクロップ
    cropped_image = image.crop((crop_width, 0, crop_width + new_width, height))
    
    # クロップした画像を保存
    cropped_image.save(output_path)

# 使用例
crop_image("C:\\Users\\user02\\Documents\\kachi-xtu-expo_dev\\media\\IMG_1416.png",
           "C:\\Users\\user02\\Documents\\kachi-xtu-expo_dev\\media\\IMG_1416x3.png", 13)  # 画像の左右の端を10%削る