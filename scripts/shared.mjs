import { Pathy, pathy } from "@bscotch/pathy";
import assert from "assert";

/**
 * @typedef {`VK_${string}`} VKCode
 */

export const downloadsDir = pathy("scripts/downloads");
export const windowsLayoutsDir = downloadsDir.join("windows-layouts");
export const windowsKeycodesFile = await downloadsDir.join(
  "windows-virtual-keycodes.html"
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
