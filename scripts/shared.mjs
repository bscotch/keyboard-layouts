import { Pathy, pathy } from "@bscotch/pathy";
import assert from "assert";

/**
 * @typedef {`VK_${string}`} VKCode
 */

export const downloadsDir = pathy("scripts/downloads");
export const windowsLayoutsDir = downloadsDir.join("windows-layouts");
export const windowsKeycodesFile = downloadsDir.join(
  "windows-virtual-keycodes.html"
);
export const windowsLanguagesFile = downloadsDir.join("windows-languages.html");
export const windowsLanguageLayoutsFile = downloadsDir.join(
  "windows-language-layouts.html"
);
/** @type {Pathy<{[driver:string]:{klids:string[], langs:string[], vk:{[code:string]:string}}}>} */
export const windowsVkCodeOverridesFile = pathy(
  "windows-vkcode-overrides.json"
);

export async function getWindowsLayoutFiles() {
  const files = await windowsLayoutsDir.listChildren();

  /** @type {Map<string, {infoPath?:Pathy, keysPath?:Pathy}>} */
  const names = new Map();
  for (const file of files) {
    if (file.name.startsWith("kbd")) {
      names.set(file.name, names.get(file.name) || {});
      const info = defined(names.get(file.name));
      if (file.hasExtension("html")) {
        info.infoPath = file;
      } else if (file.hasExtension("xml")) {
        info.keysPath = file;
      }
    }
  }

  return names;
}

/**
 * @template T
 * @param {T} x
 * @returns {Exclude<T, undefined|null>}
 */
export function defined(x) {
  assert(x !== undefined && x !== null);
  // @ts-ignore
  return x;
}

/**
 * @param {string} name
 */
export function jsonify(x) {
  return JSON.stringify(
    x,
    (key, value) => {
      if (value instanceof Set) {
        return Array.from(value);
      } else if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    },
    2
  );
}
