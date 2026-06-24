"""
Generate Chrome extension icons from the main site's brand mark.

Source of truth:
  numerologycalc/public/logo-mark.svg

This keeps the extension icon aligned with the actual NumerologyCalc branding
instead of maintaining a separate hand-drawn fallback icon.
"""

import os
import shutil
import subprocess
import tempfile
from PIL import Image

SIZES = [16, 32, 48, 128]
ROOT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(ROOT_DIR, "icons")
SOURCE_SVG = "numerologycalc/public/logo-mark.svg"


def render_source_png():
    if not os.path.exists(SOURCE_SVG):
        raise FileNotFoundError(f"Brand mark not found: {SOURCE_SVG}")

    if shutil.which("qlmanage") is None:
        raise RuntimeError("qlmanage is required to rasterize logo-mark.svg on macOS.")

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_svg = os.path.join(temp_dir, "logo-mark.svg")
        shutil.copyfile(SOURCE_SVG, temp_svg)

        subprocess.run(
            ["qlmanage", "-t", "-s", "1024", "-o", temp_dir, temp_svg],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        rendered_path = f"{temp_svg}.png"
        if not os.path.exists(rendered_path):
            raise RuntimeError(f"Rasterized PNG not found: {rendered_path}")

        with Image.open(rendered_path) as image:
            return image.convert("RGBA").copy()


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    source = render_source_png()

    for size in SIZES:
        path = os.path.join(OUT_DIR, f"icon{size}.png")
        resized = source.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(path, format="PNG", optimize=True)
        print(f"wrote {path} ({size}x{size})")


if __name__ == "__main__":
    main()
