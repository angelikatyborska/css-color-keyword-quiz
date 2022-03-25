type Color = {
  keyword: string;
  hex: string;
  alternativeKeywords?: Array<string>;
}

const HEX_REGEX = /^#[0-9a-f]{6}$/;

function sanitizeKeyword (keyword) {
  return keyword?.toLowerCase().trim();
}

function sanitizeHex (hex) {
  return hex?.toLowerCase().trim();
}

function loadData(data: Array<any>) : Array<Color> {
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
  loadData
};
