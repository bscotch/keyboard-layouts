import { windowsVkCodeOverridesFile } from "./shared.mjs";

const [, , type, filter] = process.argv;

/** @type {'language'|'klid'|'driver'} */
let filterType;
if (type.trim() === "language") {
  filterType = "language";
} else if (type.trim() === "klid") {
  filterType = "klid";
} else if (type.trim() === "driver") {
  filterType = "driver";
} else {
  throw new Error(
    `First argument must be the filter type, one of 'language', 'klid', or 'driver'.`
  );
}

const filterValues = filter
  .trim()
  .split(",")
  .filter(Boolean)
  .map((x) => x.toLowerCase());
if (!filterValues.length) {
  throw new Error(
    `Second argument must be a comma-separated list of values to filter by.`
  );
}

const allOverrides = await windowsVkCodeOverridesFile.read();

/** @type {{klidDrivers:{[klid:string]: string}, vkToGlyphOverrides: {[driver:string]: {[code:string]:string}}, scToVkOverrides:{[driver:string]:{[scancode:string]:number}}}} */
const filtered = {
  klidDrivers: {},
  vkToGlyphOverrides: {},
  scToVkOverrides: {},
};
for (const [driver, info] of Object.entries(allOverrides)) {
  if (filterType === "driver" && !filterValues.includes(driver)) {
    continue;
  } else if (
    filterType === "klid" &&
    !filterValues.some((klid) => info.klids.includes(klid))
  ) {
    continue;
  } else if (
    filterType === "language" &&
    !filterValues.some((searchLang) => includesLang(searchLang, info.langs))
  ) {
    continue;
  }
  // If we made it here we're keeping this driver!
  for (const klid of info.klids) {
    filtered.klidDrivers[klid] = driver;
  }
  filtered.vkToGlyphOverrides[driver] = info.codes.vk;
  filtered.scToVkOverrides[driver] = info.codes.sc;
}

console.log(JSON.stringify(filtered, null, 2));

/**
 * Allow for fuzzy matching of a language code
 * @param {string} searchLang
 * @param {string[]} langs
 */
function includesLang(searchLang, langs) {
  const asPattern = new RegExp(`^${searchLang}`, "i");
  return langs.some((lang) => asPattern.test(lang));
}
