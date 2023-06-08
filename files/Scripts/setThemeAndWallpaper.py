#!/usr/bin/env python
from material_color_utilities_python import *
import subprocess

import os
import sys

fn = sys.argv[1]

img = Image.open(fn)
basewidth = 64
wpercent = (basewidth/float(img.size[0]))
hsize = int((float(img.size[1])*float(wpercent)))
img = img.resize((basewidth, hsize), Image.Resampling.LANCZOS)
theme = themeFromImage(img, [
    {"blend": True, "value": argbFromHex("#f38ba8"), "name": "red"},
    {"blend": True, "value": argbFromHex("#fab387"), "name": "orange"},
    {"blend": False, "value": argbFromHex("#f9e2af"), "name": "yellow"},
    {"blend": False, "value": argbFromHex("#a6e3a1"), "name": "green"},
    {"blend": True, "value": argbFromHex("#94e2d5"), "name": "blue"},
    {"blend": True, "value": argbFromHex("#89b4fa"), "name": "darkBlue"},
    {"blend": True, "value": argbFromHex("#cba6f7"), "name": "magenta"},
    {"blend": False, "value": argbFromHex("#f2cdcd"), "name": "brown"},
]
)

yellowPalette = TonalPalette.fromInt(
    theme.get("customColors")[2].get("dark").get("color"))
themePalette = theme.get("palettes")
scheme = theme.get("schemes")
themePaletteSecondary = themePalette.get("secondary")
themePalettePrimary = themePalette.get("primary")
themePaletteTertiary = themePalette.get("tertiary")
themePaletteError = themePalette.get("error")
themePaletteNeutral = themePalette.get("neutral")
themePaletteNeutralVariant = themePalette.get("neutralVariant")

finalString = "scheme: \"Material you\"\nauthor: \"Arsi\""

parsed_colors = {
    "base00": hexFromArgb(scheme.get("dark").background)[1:],
    "base01": hexFromArgb(themePaletteNeutral.tone(6))[1:],
    "base02": hexFromArgb(scheme.get("dark").surfaceVariant)[1:],
    "base03": hexFromArgb(scheme.get("dark").outline)[1:],
    "base04": hexFromArgb(scheme.get("dark").onSurface)[1:],
    "base05": hexFromArgb(scheme.get("dark").onBackground)[1:],
    "base06": hexFromArgb(scheme.get("dark").onBackground)[1:],
    "base07": hexFromArgb(scheme.get("dark").primary)[1:],
    "base08": hexFromArgb(theme.get("customColors")[0].get("dark").get("color"))[1:],
    "base09": hexFromArgb(theme.get("customColors")[1].get("dark").get("color"))[1:],
    "base0A": hexFromArgb(yellowPalette.tone(90))[1:],
    "base0B": hexFromArgb(theme.get("customColors")[3].get("dark").get("color"))[1:],
    "base0C": hexFromArgb(theme.get("customColors")[4].get("dark").get("color"))[1:],
    "base0D": hexFromArgb(theme.get("customColors")[5].get("dark").get("color"))[1:],
    "base0E": hexFromArgb(theme.get("customColors")[6].get("dark").get("color"))[1:],
    "base0F": hexFromArgb(theme.get("customColors")[7].get("dark").get("color"))[1:],
}

print(theme.get("customColors")[0])

for key, value in parsed_colors.items():
    finalString += "\n{}: \"{}\"".format(key, value)

themeFile = open(
    "/home/posaydone/.config/flavours/schemes/materialyou/materialyou.yaml", "wt")
themeFile.write(finalString)
themeFile.close()

subprocess.run(["flavours", "apply", "materialyou"])
wp = os.system("setWallpaper {}".format(fn))

# print(finalString)
