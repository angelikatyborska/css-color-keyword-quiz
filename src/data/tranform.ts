import type { Color } from "../color";
import { hexToHSL, hexToRGB, HEX_REGEX, calculateColorDiff } from "../color";

function sanitizeKeyword(keyword) {
  return keyword?.toLowerCase().trim();
}

function sanitizeHex(hex) {
  return hex?.toLowerCase().trim();
}

function loadColors(data: Array<any>) : Array<Color> { // eslint-disable-line @typescript-eslint/no-explicit-any
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
      alternativeKeywords: (c.alternativeKeywords || []).map(k => sanitizeKeyword(k)),
      hex: sanitizeHex(c.hex),
      rgb: hexToRGB(sanitizeHex(c.hex)),
    };
  });
}

function dataObjectToColor(c) {
  return {
    keyword: sanitizeKeyword(c.keyword),
    alternativeKeywords: (c.alternativeKeywords || []).map(k => sanitizeKeyword(k)),
    hex: sanitizeHex(c.hex),
    hsl: hexToHSL(sanitizeHex(c.hex)),
    rgb: hexToRGB(sanitizeHex(c.hex)),
  };
}

// TODO: do this during the build
function calculateDiffMatrix(colors: Array<Color>) {
  return colors.reduce((acc1, color1) => {
    return {
      ...acc1,
      [color1.keyword]: colors.reduce((acc2, color2) => {
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
function findTopSimilar(colors: Array<Color>, diffMatrix: Record<string, Record<string, number>>, color: Color, n: number): Array<Color> {
  const sorted = colors
    .filter(color2 => diffMatrix[color.keyword][color2.keyword] !== 0)
    .sort((a, b) =>
      diffMatrix[color.keyword][a.keyword] - diffMatrix[color.keyword][b.keyword]
    );

  return sorted.slice(0, n);
}

export { loadColors, dataObjectToColor, calculateDiffMatrix, findTopSimilar };
