"""One-shot portrait background removal via u2netp (onnxruntime).
Produces: public/photos/portrait-cutout.png (RGBA, tight-cropped)
          public/photos/portrait-cutout-rim.png (with cyan rim-light bake)
No generative editing — original pixels only, plus alpha + rim glow."""
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter, ImageOps

SRC, MODEL = "public/photos/portrait.webp", "assets-src/u2netp.onnx"

im = Image.open(SRC).convert("RGB")
w, h = im.size

# u2netp expects 320x320 normalized
inp = im.resize((320, 320), Image.LANCZOS)
x = np.asarray(inp, dtype=np.float32) / 255.0
x = (x - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
x = x.transpose(2, 0, 1)[None].astype(np.float32)

sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
pred = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
pred = (pred - pred.min()) / (pred.max() - pred.min() + 1e-8)

mask = Image.fromarray((pred * 255).astype(np.uint8)).resize((w, h), Image.LANCZOS)
# clean the matte: slight blur to feather, then push contrast so edges commit
mask = mask.filter(ImageFilter.GaussianBlur(2))
mask = ImageOps.autocontrast(mask, cutoff=1)
m = np.asarray(mask, dtype=np.float32) / 255.0
m = np.clip((m - 0.35) / 0.35, 0, 1)  # hard floor: kill background haze
mask = Image.fromarray((m * 255).astype(np.uint8))

rgba = im.copy(); rgba.putalpha(mask)

# tight crop to subject
bbox = mask.getbbox(); rgba = rgba.crop(bbox)
rgba.save("public/photos/portrait-cutout.png", optimize=True)

# rim-lit variant: cyan edge glow baked behind the subject
a = rgba.split()[3]
edge = a.filter(ImageFilter.MaxFilter(9))
glow = Image.new("RGBA", rgba.size, (75, 225, 255, 0))
glow.putalpha(edge.filter(ImageFilter.GaussianBlur(10)))
base = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
base = Image.alpha_composite(base, glow)
base = Image.alpha_composite(base, rgba)
base.save("public/photos/portrait-cutout-rim.png", optimize=True)
print("cutout:", rgba.size, "->", "portrait-cutout.png / portrait-cutout-rim.png")
