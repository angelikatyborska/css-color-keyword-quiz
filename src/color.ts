type hex = string;

type HSL = {
  h: number, // from 0 to 360
  s: number, // from 0 to 100
  l: number // from 0 to 100
}

type Color = {
  keyword: string;
  hex: hex;
  // hsl: HSL;
  alternativeKeywords?: Array<string>;
}

const HEX_REGEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

function hexToHSL(hex: hex) : HSL {
  const result = HEX_REGEX.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  r /= 255;
  g /= 255;
  b /= 255;
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
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return { h, s, l };
}

function sanitizeKeyword(keyword) {
  return keyword?.toLowerCase().trim();
}

function sanitizeHex(hex) {
  return hex?.toLowerCase().trim();
}

function loadData(data: Array<any>) : Array<Color> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const knownKeys = ["keyword", "hex", "alternativeKeywords"];

  data.forEach(c => {
    if (!c.keyword) {
      throw new Error(
        `missing keyword: '${JSON.stringify(c)}'`
      );
    }

    if (!c.hex) {
      throw new Error(
        `missing hex: '${JSON.stringify(c)}'`
      );
    }

    if (!sanitizeHex(c.hex).match(HEX_REGEX)) {
      throw new Error(
        `invalid hex: '${c.hex}'`
      );
    }

    const unknownKeys = Object.keys(c).filter(key => knownKeys.indexOf(key) === -1);

    if (unknownKeys.length > 0) {
      throw new Error(
        `unknown keys '${unknownKeys}' in object '${JSON.stringify(c)}'`
      );
    }
  });

  const hexes = data.map(c => sanitizeHex(c.hex));
  const duplicateHexes = hexes.reduce((acc, hex, index, self) => {
    if (self.indexOf(hex) === index) {
      return acc;
    } else {
      return [hex, ...acc];
    }
  }, []);

  if (duplicateHexes.length > 0) {
    throw Error(
      `found duplicate hex values: '${duplicateHexes}'. Use alternativeKeywords instead.`
    );
  }

  const names = data.reduce((acc, c) => {
    if (c.alternativeKeywords && (
      !Array.isArray(c.alternativeKeywords) ||
      c.alternativeKeywords.some(x => typeof x !== "string"))
    ) {
      throw new Error(`'alternativeKeywords' must be an array of strings, found: '${c.alternativeKeywords}'`);
    }

    return [
      sanitizeKeyword(c.keyword),
      ...(c.alternativeKeywords?.map(n => sanitizeKeyword(n)) || []),
      ...acc
    ];
  }, []);

  const duplicateNames = names.reduce((acc, name, index, self) => {
    if (self.indexOf(name) === index) {
      return acc;
    } else {
      return [name, ...acc];
    }
  }, []);

  if (duplicateNames.length > 0) {
    throw new Error(
      `found duplicate keywords and/or alternativeKeywords: '${duplicateNames}'`
    );
  }

  return data.map(c => {
    return {
      keyword: sanitizeKeyword(c.keyword),
      hex: sanitizeHex(c.hex),
      alternativeKeywords: (c.alternativeKeywords || []).map(k => sanitizeKeyword(k))
    };
  });
}

export {
  hexToHSL,
  loadData
};
