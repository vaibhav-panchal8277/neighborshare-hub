from PIL import Image

def analyze_image(path):
    img = Image.open(path)
    print(f"Image: {path}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")
    
    # Find bounding box of non-zero alpha
    if img.mode == 'RGBA':
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        print(f"Non-transparent BBox (left, upper, right, lower): {bbox}")
        if bbox:
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            print(f"Cropped dimensions: {w}x{h}")
            print(f"Top padding: {bbox[1]}, Bottom padding: {img.size[1] - bbox[3]}")
            print(f"Left padding: {bbox[0]}, Right padding: {img.size[0] - bbox[2]}")
    else:
        print("Not RGBA")

analyze_image(r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\public\logo.png")
analyze_image(r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\public\logo-icon.png")
