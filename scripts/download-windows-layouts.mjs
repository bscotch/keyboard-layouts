import assert from "node:assert";
import {
  downloadsDir,
  windowsKeycodesFile,
  windowsLayoutsDir,
} from "./shared.mjs";

//#region IDENTIFIERS
const kbdInfoIndexHtml = await (await fetch("https://kbdlayout.info/")).text();

// Extract all keyboard layout names, which are organized by driver.
// Driver names look like: KBDKHMR.DLL
const driverNamesRaw = kbdInfoIndexHtml.match(/\bkbd[a-z0-9]+\.dll/gi);
assert(driverNamesRaw !== null);

/** @type {Set<string>} */
const driverNames = new Set();
for (const driverName of driverNamesRaw) {
  driverNames.add(driverName.toLowerCase().replace(/\.dll$/, ""));
}
//#endregion

//#region LAYOUTS
// For each driver, download its key mapping file and its general info

await windowsLayoutsDir.ensureDir();
for (const driverName of driverNames) {
  const infoFile = windowsLayoutsDir.join(`${driverName}.html`);
  if (!(await infoFile.exists())) {
    const infoHtml = await (
      await fetch(`https://kbdlayout.info/${driverName}`)
    ).text();
    await infoFile.write(infoHtml);
  }

  const mappingFile = windowsLayoutsDir.join(`${driverName}.xml`);
  if (!(await mappingFile.exists())) {
    const mappingHtml = await (
      await fetch(`https://kbdlayout.info/${driverName}/download/xml`)
    ).text();
    await mappingFile.write(mappingHtml);
  }
}

const keycodesHtml = await (
  await fetch(
    "https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes"
  )
).text();

await downloadsDir.ensureDir();
await windowsKeycodesFile.write(keycodesHtml);
//#endregion
