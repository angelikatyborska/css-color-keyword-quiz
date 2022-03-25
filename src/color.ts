import rawJSONData from "./colors.json";
type hex = string;

type RGB = {
  r: number, // from 0 to 255
  g: number, // from 0 to 255
  b: number // from 0 to 255
}

type Color = {
  keyword: string;
  hex: hex;
  rgb: RGB;
  alternativeKeywords?: Array<string>;
}

const HEX_REGEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

function hexToRGB(hex: hex) : RGB {
  const result = HEX_REGEX.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return { r, g, b };
}

function calculateColorDiff(color1: RGB, color2: RGB) : number {
  const rDiff = (color1.r - color2.r);
  const gDiff = (color1.g - color2.g);
  const bDiff = (color1.b - color2.b);

  const diff = Math.abs(rDiff) + Math.abs(gDiff) + Math.abs(bDiff);
  return Math.round(diff * 100) / 100;
}

export type { Color, RGB };
export {
  rawJSONData,
  HEX_REGEX,
  hexToRGB,
  calculateColorDiff
};
