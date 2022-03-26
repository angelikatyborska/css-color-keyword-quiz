type hex = string;

type HSL = {
  h: number, // from 0 to 360
  s: number, // from 0 to 100
  l: number // from 0 to 100
}

type RGB = {
  r: number, // from 0 to 255
  g: number, // from 0 to 255
  b: number // from 0 to 255
}

type ColorKey = string;

type Color = {
  keyword: ColorKey;
  hex: hex;
  rgb: RGB;
  alternativeKeywords: Array<string>;
}

type ColorList = Array<Color>;
type ColorKeyList = Array<ColorKey>;
type ColorMap = Record<ColorKey, Color>;
type ColorDiffMatrix = Record<ColorKey, Record<ColorKey, number>>;

const MAX_HUE = 360;
const MAX_SATURATION = 100;
const MAX_LIGHTNESS = 100;
const MAX_RGB_COMPONENT = 255;

const DIFF_VALUE_FOR_SYNONYMS = 50;

const HEX_REGEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

// TODO: decide if this is needed
function hexToHSL(hex: hex) : HSL {
  let { r, g, b } = hexToRGB(hex);
  r /= MAX_RGB_COMPONENT;
  g /= MAX_RGB_COMPONENT;
  b /= MAX_RGB_COMPONENT;
  const max = Math.max(r, g, b); const min = Math.min(r, g, b);
  let h; let s; let l = (max + min) / 2; // eslint-disable-line prefer-const
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  h = Math.round(h * MAX_HUE);
  s = Math.round(s * MAX_SATURATION);
  l = Math.round(l * MAX_LIGHTNESS);
  return { h, s, l };
}

function hexToRGB(hex: hex) : RGB {
  const result = HEX_REGEX.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return { r, g, b };
}

function sanitizeKeyword(keyword) {
  return keyword?.toLowerCase().trim();
}

function sanitizeHex(hex) {
  return hex?.toLowerCase().trim();
}

function calculateColorDiff(color1: Color, color2: Color) : number {
  const rDiff = Math.abs(color1.rgb.r - color2.rgb.r);
  const gDiff = Math.abs(color1.rgb.g - color2.rgb.g);
  const bDiff = Math.abs(color1.rgb.b - color2.rgb.b);

  // let hDiff = Math.abs(color1.hsl.h - color2.hsl.h);
  // hue wheel, hue 0 == hue 360
  // if (hDiff > 180) { hDiff = 360 - hDiff }
  // const sDiff = Math.abs(color1.hsl.s - color2.hsl.s);
  // const lDiff = Math.abs(color1.hsl.l - color2.hsl.l);

  const rgbDiff = rDiff + gDiff + bDiff;
  // const MAX_RGB_DIFF = MAX_RGB_COMPONENT * 3;
  let diff = rgbDiff;

  // account for people mixing up colors just because they have similar names
  const names = [
    ["gray", "silver"],
    ["green", "chartreuse", "lime"],
    ["purple", "violet", "orchid", "plum"],
    ["red"],
    ["turquoise"],
    ["blue"],
    ["yellow"],
    ["pink", "orchid"],
    ["teal", "turquoise", "aquamarine"]
  ];

  if (names.some(synonyms => {
    return synonyms.some(x => [color1.keyword, ...color1.alternativeKeywords].join(",").includes(x)) &&
    synonyms.some(x => [color2.keyword, ...color2.alternativeKeywords].join(",").includes(x));
  })) {
    diff = Math.min(diff, DIFF_VALUE_FOR_SYNONYMS);
  }

  return Math.round(diff * 100) / 100;
}

// TODO: do this during the build
function calculateDiffMatrix(colors: ColorMap) : ColorDiffMatrix {
  return Object.values(colors).reduce((acc1, color1) => {
    return {
      ...acc1,
      [color1.keyword]: Object.values(colors).reduce((acc2, color2) => {
        return {
          ...acc2,
          [color2.keyword]: (acc1[color2.keyword] && acc1[color2.keyword][color1.keyword])
            ? acc1[color2.keyword][color1.keyword]
            : calculateColorDiff(color1, color2)
        };
      }, {})
    };
  }, {});
}

// TODO: do this during the build
function findTopSimilar(colorKeys: ColorKeyList, diffMatrix: ColorDiffMatrix, colorKey: ColorKey, n: number): Array<string> {
  const sorted = colorKeys
    .filter(colorKey2 => diffMatrix[colorKey][colorKey2] !== 0)
    .sort((a, b) =>
      diffMatrix[colorKey][a] - diffMatrix[colorKey][b]
    );

  return sorted.slice(0, n);
}

export type { Color, ColorKey, ColorMap, ColorList, ColorKeyList, ColorDiffMatrix };
export {
  HEX_REGEX,
  hexToHSL,
  hexToRGB,
  calculateColorDiff,
  calculateDiffMatrix,
  findTopSimilar,
  sanitizeKeyword,
  sanitizeHex
};
