from PIL import Image
import numpy as np

def remove_white_background(input_path, output_path, threshold=230):
    """
    Remove ALL near-white pixels from the image (global approach).
    Works for logos where white only appears as background (not as content).
    Uses feathering at edges for smooth anti-aliased result.
    """
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)

    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]

    # Calculate "whiteness" - how close each pixel is to white
    whiteness = np.minimum(np.minimum(r, g), b)

    # Create smooth alpha: pixels above threshold get gradually transparent
    # Below threshold-20 = fully opaque, above threshold = fully transparent
    feather = 20
    alpha_scale = np.clip((threshold - whiteness) / feather, 0, 1)

    # Apply the new alpha
    data[:, :, 3] = (a * alpha_scale).astype(np.uint8)

    result = Image.fromarray(data.astype(np.uint8))
    result.save(output_path, "PNG")
    print(f"Saved: {output_path}")


# Process B icon only
remove_white_background(
    r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\public\ChatGPT Image May 27, 2026, 05_04_31 PM.png",
    r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\public\logo-icon.png",
    threshold=230
)

# Process full logo (Borrowly with text) — text is dark navy so safe to remove whites
remove_white_background(
    r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\public\ChatGPT Image May 27, 2026, 04_53_40 PM.png",
    r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\public\logo.png",
    threshold=230
)

# Also update the favicon
import shutil
shutil.copy(
    r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\public\logo-icon.png",
    r"d:\Vaibhav-panchal-TG\github_projects\neighborshare-hub\src\app\favicon.ico"
)

print("All done!")
