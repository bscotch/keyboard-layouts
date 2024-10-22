import { Pathy } from "@bscotch/pathy";
import assert from "assert";
import * as cheerio from "cheerio";
import fs from "node:fs/promises";
import {
  defined,
  getWindowsLayoutFiles,
  jsonify,
  windowsKeycodesFile,
  windowsVkCodeOverridesFile,
} from "./shared.mjs";

/**
 * @typedef {{vk:{[code:`${number}`]:string}, sc:{[code:string]: number}}} VirtualMappings
 */

const layoutFiles = await getWindowsLayoutFiles();
const keyCodes = await getVirtualKeycodes(windowsKeycodesFile);
/** @type {Map<string, {klids: Set<string>, langs: Set<string>, codes: VirtualMappings}>} */
const driverSummaries = new Map();

/** @type {Map<string, VirtualMappings>} */
const driverVkCodes = new Map();

// We only care about stuff that deviates from the US Layout. So first we need to get the US layout.

const usLayout = defined(layoutFiles.get("kbdus"));
/** @type {VirtualMappings} */
let usVkCodes = { vk: {}, sc: {} };
driverVkCodes.set(
  "kbdus",
  await getVirtualKeyMappings(defined(usLayout.keysPath), "en-US")
);
usVkCodes = defined(driverVkCodes.get("kbdus"));

for (const [name, files] of layoutFiles) {
  // Parse the HTML info file to get the layout metadata
  const metadata = await getLayoutMetadata(name, defined(files.infoPath));
  const lang = metadata[0]?.lang;

  // Parse the XML key mapping file to get the key mappings. We want to map the virtual key codes to the UTF8 characters.
  const keyMappings = await getVirtualKeyMappings(
    defined(files.keysPath),
    lang
  );
  driverVkCodes.set(name, keyMappings);
}

for (const [name, summary] of driverSummaries) {
  summary.codes = driverVkCodes.get(name) || { vk: {}, sc: {} };
}
await fs.writeFile(
  windowsVkCodeOverridesFile.absolute,
  jsonify(driverSummaries)
);

/**
 *
 * @param {Pathy} htmlFile
 */
async function getVirtualKeycodes(htmlFile) {
  const $ = cheerio.load(await htmlFile.read());
  const rows = $($("table")[0]).find("tr");
  /** @type {Map<import("./shared.mjs").VKCode, {name:import("./shared.mjs").VKCode, number:number, description:string}>} */
  const vkCodes = new Map();
  for (const row of rows) {
    const cells = $(row).find("td");
    let vkCode = /** @type {import("./shared.mjs").VKCode} */ (
      $(cells[0]).text().trim()
    );
    const hex = $(cells[1]).text().trim();
    const description = $(cells[2]).text().trim();
    if (!hex.match(/0x[0-9A-F]{2}/)) continue;
    if (!vkCode) {
      // Then this is probably a character key and we
      // need to construct its VK code.
      const char = description.match(/(?<char>[A-Z0-9])/)?.[0];
      if (!char) {
        console.error(`Could not parse character from ${description}`);
        continue;
      }
      vkCode = `VK_${char}`;
    }
    // Convert the hex to a number
    vkCodes.set(vkCode, {
      name: vkCode,
      number: parseInt(hex, 16),
      description,
    });
  }
  return vkCodes;
}

/**
 * @param {Pathy} xmlFile
 * @param {string} lang
 * @returns {Promise<VirtualMappings>}
 */
async function getVirtualKeyMappings(xmlFile, lang) {
  const $ = cheerio.load(await xmlFile.read());
  const keys = $("PK");
  /** @type {VirtualMappings} */
  const mappings = { vk: {}, sc: {} };
  for (const key of keys) {
    const vk = $(key).attr("vk");
    const scanCode = $(key).attr("sc");
    assert(vk, "VK attribute missing");
    assert(scanCode, "Scan code attribute missing");
    const vkNum = keyCodes.get(vk)?.number;
    if (vkNum === undefined) continue;
    mappings.sc[scanCode] = vkNum; // want all scan codes
    const values = $(key).find("result:not([with])");
    if (values.length !== 1) continue;
    let value = $(values[0]).attr("text");
    if (!value) continue;
    // Uppercase it for convention
    value = value.toLocaleUpperCase(lang);

    // We only want things that deviate from the US layout
    if (usVkCodes.vk[`${vkNum}`] !== value) {
      mappings.vk[`${vkNum}`] = value;
    }
  }
  return mappings;
}

/**
 * @param {string} name
 * @param {Pathy} htmlFile
 * @returns {Promise<{ id:string, lang:string, layout:string}[]>}
 */
async function getLayoutMetadata(name, htmlFile) {
  const $ = cheerio.load(await htmlFile.read());
  const metadataTables = $(".metaGroup.group > table");

  const allMetadata = [];
  for (const table of metadataTables) {
    const rows = $(table).find("tr");
    const firstHeader = $(rows[0]).find("th").text().trim();
    if (firstHeader !== "KLID") continue;
    const metadata = {
      id: "",
      lang: "",
      layout: "",
    };
    allMetadata.push(metadata);
    for (const row of rows) {
      const key = $(row).find("th").text().trim();
      const value = $(row).find("td").text().trim();
      if (key === "KLID") {
        const { id, lang } =
          value.match(/(?<id>[\da-z]+) \((?<lang>.+)\)/)?.groups || {};
        assert(id, `Could not parse KLID from ${value}`);
        assert(lang, `Could not parse language from ${value}`);
        metadata.id = id;
        metadata.lang = lang;
        driverSummaries.set(
          name,
          driverSummaries.get(name) || {
            klids: new Set(),
            langs: new Set(),
            codes: { vk: {}, sc: {} },
          }
        );
        driverSummaries.get(name)?.klids.add(id);
        driverSummaries.get(name)?.langs.add(lang);
      } else if (key === "Layout Display Name") {
        metadata.layout = value;
      }
    }
  }
  return allMetadata;
}
