# Keyboard Layouts & Virtual Keycodes

When we handle keyboard inputs in GameMaker, on Windows, what we get is a "virtual key" constant value. This value is generated by the operating system based on the user's keyboard layout.

For handling inputs this doesn't really matter, because we don't actually care what glyph the key corresponds to.

The problem is that when we _display_ the keybindings they'll show the wrong thing for some keys when the user is on a non-US keyboard. This will be very confusing to the user, since neither the default nor their set keybindings will look like the buttons they press.

To that end, we need to be able to map all of the virtual keycodes to characters based on the user's keyboard. For each supported language we'd want reasonable defaults, but also need to allow the user to specify a different layout (since a user can use a different keyboard layout than the default for their language).

Further, for game inputs we care more about the _position_ on the keyboard rather than the glyph it corresponds to (e.g. the physical position of `WASD` is what we care about for character movement). We can use "scan codes" to get that information. The game only has access to the virtual keys, but we can look up the scan code for a given virtual key by keyboard.

## Usage

### All VK Code Overrides

The file [`windows-vkcode-overrides.json`](./windows-vkcode-overrides.json) summarizes all keyboard layouts by driver, including Virtual Key overrides (relative to the US Keyboard), languages, and KLIDs for all layouts.

### Filtered VK Code Overrides

It's likely that you only want a subset of VK Code overrides for a given project. To that end you'll need to run some code, so there's some setup to do:

- Ensure [NodeJS](https://nodejs.org/en) is installed (v16+ minimum, ideally v20+)
- Clone/Pull this repo
- This project should work with `npm`, but is developed using `pnpm`. For best compatibility use [pnpm](https://pnpm.io/installation)
- In this project directory, run `pnpm install` (or `npm install` if you are using `npm`)
- (optional) To scrape the latest remote resources, run `pnpm download && pnpm process` (or, for `npm`, `npm run download && npm run process`).

Once that's all done, to get a JSON file of Virtual Keycodes that deviate from the US Keyboard layout (when uppercased), run `node.exe scripts/get-windows-vk-overrides.mjs` with a comma-separated filter list of either language codes (e.g `en,zh`), driver names (e.g. `kbdus`), or KLIDs (e.g. `00000409`).

For example:

`node.exe scripts/get-windows-vk-overrides.mjs language de,es,fr,it,ja,ko,pl,pt,tr,zh`

<details>

<summary>Returns:</summary>

```json
{
  "klidDrivers": {
    "0000080c": "kbdbe",
    "00000813": "kbdbe",
    "0001080c": "kbdbene",
    "00000416": "kbdbr",
    "00010416": "kbdbr",
    "0001040a": "kbdes",
    "00000c0c": "kbdfc",
    "0000040c": "kbdfr",
    "0001040c": "kbdfrna",
    "0002040c": "kbdfrnb",
    "00000407": "kbdgr",
    "00010407": "kbdgr1",
    "00020407": "kbdgre1",
    "00030407": "kbdgre2",
    "00000410": "kbdit",
    "00010410": "kbdit142",
    "00000411": "kbdjpn",
    "00000412": "kbdkor",
    "0000080a": "kbdla",
    "00010415": "kbdpl",
    "00000415": "kbdpl1",
    "00000816": "kbdpo",
    "0000046e": "kbdsf",
    "0000100c": "kbdsf",
    "00000807": "kbdsg",
    "0000040a": "kbdsp",
    "0001041f": "kbdtuf",
    "0000041f": "kbdtuq",
    "00010402": "kbdus",
    "00000404": "kbdus",
    "00000409": "kbdus",
    "00000804": "kbdus",
    "00000c04": "kbdus",
    "00001004": "kbdus",
    "00001404": "kbdus"
  },
  "vkToGlyphOverrides": {
    "kbdbe": {
      "48": "À",
      "49": "&",
      "50": "É",
      "51": "\"",
      "52": "'",
      "53": "(",
      "54": "§",
      "55": "È",
      "56": "!",
      "57": "Ç",
      "186": "$",
      "190": ";",
      "191": ":",
      "192": "Ù",
      "219": ")",
      "220": "Μ",
      "222": "²",
      "226": "<"
    },
    "kbdbene": {
      "48": "À",
      "49": "&",
      "50": "É",
      "51": "\"",
      "52": "'",
      "53": "(",
      "54": "§",
      "55": "È",
      "56": "!",
      "57": "Ç",
      "186": "$",
      "190": ";",
      "191": ":",
      "192": "Ù",
      "219": ")",
      "220": "Μ",
      "222": "²",
      "226": "<"
    },
    "kbdbr": {
      "186": "Ç",
      "191": ";",
      "192": "'",
      "220": "]",
      "221": "["
    },
    "kbdes": {
      "192": "Ñ",
      "220": "'",
      "221": "÷",
      "222": "Ç",
      "223": "=",
      "226": "<"
    },
    "kbdfc": {
      "191": "É",
      "192": "È",
      "220": "À",
      "221": "Ç",
      "222": "°",
      "226": "Ù"
    },
    "kbdfr": {
      "48": "À",
      "49": "&",
      "50": "É",
      "51": "\"",
      "52": "'",
      "53": "(",
      "54": "-",
      "55": "È",
      "56": "_",
      "57": "Ç",
      "186": "$",
      "190": ";",
      "191": ":",
      "192": "Ù",
      "219": ")",
      "220": "*",
      "222": "²",
      "223": "!",
      "226": "<"
    },
    "kbdfrna": {
      "48": "»",
      "49": "À",
      "50": "É",
      "51": "È",
      "52": "Ê",
      "53": "(",
      "54": ")",
      "55": "‘",
      "56": "’",
      "57": "«",
      "187": "+",
      "191": ":",
      "192": "@",
      "219": "/",
      "220": "*",
      "226": "<"
    },
    "kbdfrnb": {
      "48": "*",
      "49": "\"",
      "50": "«",
      "51": "»",
      "52": "(",
      "53": ")",
      "54": "@",
      "55": "+",
      "56": "-",
      "57": "/",
      "186": "É",
      "187": "%",
      "189": "=",
      "191": "È",
      "192": "’",
      "220": "Ç",
      "221": "À",
      "222": "$",
      "226": "Ê"
    },
    "kbdgr": {
      "186": "Ü",
      "187": "+",
      "191": "#",
      "192": "Ö",
      "219": "SS",
      "222": "Ä",
      "226": "<"
    },
    "kbdgr1": {
      "186": "Ü",
      "187": "+",
      "191": "#",
      "192": "Ö",
      "219": "SS",
      "222": "Ä",
      "226": "<"
    },
    "kbdgre1": {
      "186": "Ü",
      "187": "+",
      "191": "#",
      "192": "Ö",
      "219": "SS",
      "222": "Ä",
      "226": "<"
    },
    "kbdgre2": {
      "186": "Ü",
      "187": "+",
      "191": "#",
      "192": "Ö",
      "219": "SS",
      "222": "Ä"
    },
    "kbdit": {
      "186": "È",
      "187": "+",
      "191": "Ù",
      "192": "Ò",
      "219": "'",
      "221": "Ì",
      "222": "À",
      "226": "<"
    },
    "kbdit142": {
      "186": "È",
      "187": "+",
      "191": "Ù",
      "192": "Ò",
      "219": "'",
      "221": "Ì",
      "222": "À",
      "226": "<"
    },
    "kbdjpn": {},
    "kbdkor": {},
    "kbdla": {
      "187": "+",
      "191": "}",
      "192": "Ñ",
      "219": "'",
      "220": "|",
      "221": "¿",
      "222": "{",
      "226": "<"
    },
    "kbdpl": {
      "186": "Ł",
      "187": "+",
      "191": "'",
      "219": "Ż",
      "220": "Ó",
      "221": "Ś",
      "222": "Ą",
      "226": "<"
    },
    "kbdpl1": {},
    "kbdpo": {
      "187": "+",
      "192": "Ç",
      "219": "'",
      "221": "«",
      "222": "º",
      "226": "<"
    },
    "kbdsf": {
      "186": "È",
      "191": "§",
      "219": "'",
      "220": "À",
      "222": "É",
      "223": "$",
      "226": "<"
    },
    "kbdsg": {
      "186": "Ü",
      "191": "§",
      "219": "'",
      "220": "Ä",
      "222": "Ö",
      "223": "$",
      "226": "<"
    },
    "kbdsp": {
      "187": "+",
      "191": "Ç",
      "192": "Ñ",
      "219": "'",
      "220": "º",
      "221": "¡",
      "226": "<"
    },
    "kbdtuf": {
      "186": "Ğ",
      "187": "/",
      "191": "Ç",
      "192": "+",
      "219": "İ",
      "220": "Ö",
      "221": "Ü",
      "222": "Ş",
      "226": "<"
    },
    "kbdtuq": {
      "186": "Ş",
      "191": "Ö",
      "192": "\"",
      "219": "Ğ",
      "220": "Ç",
      "221": "Ü",
      "222": "İ",
      "223": "*",
      "226": "<"
    },
    "kbdus": {}
  },
  "scToVk": {
    "kbdbe": {
      "10": 65,
      "11": 90,
      "27": 77,
      "28": 192,
      "29": 222,
      "32": 188,
      "33": 190,
      "34": 191,
      "35": 187,
      "0C": 219,
      "0D": 189,
      "1B": 186,
      "1E": 81,
      "2C": 87
    },
    "kbdbene": {
      "10": 65,
      "11": 90,
      "27": 77,
      "28": 192,
      "29": 222,
      "32": 188,
      "33": 190,
      "34": 191,
      "35": 187,
      "0C": 219,
      "0D": 189,
      "1B": 186,
      "1E": 81,
      "2C": 87
    },
    "kbdbr": {},
    "kbdes": {
      "27": 192,
      "29": 220,
      "35": 223,
      "1A": 221
    },
    "kbdfc": {
      "28": 192,
      "29": 222
    },
    "kbdfr": {
      "10": 65,
      "11": 90,
      "27": 77,
      "28": 192,
      "29": 222,
      "32": 188,
      "33": 190,
      "34": 191,
      "35": 223,
      "0C": 219,
      "1B": 186,
      "1E": 81,
      "2C": 87
    },
    "kbdfrna": {
      "10": 65,
      "11": 90,
      "27": 77,
      "28": 219,
      "32": 190,
      "34": 191,
      "35": 186,
      "0C": 222,
      "1A": 189,
      "1B": 187,
      "1E": 81,
      "2C": 87
    },
    "kbdfrnb": {
      "10": 66,
      "11": 186,
      "12": 80,
      "13": 79,
      "14": 191,
      "16": 86,
      "17": 68,
      "18": 76,
      "19": 74,
      "20": 73,
      "21": 69,
      "22": 188,
      "23": 67,
      "24": 84,
      "25": 83,
      "26": 82,
      "27": 78,
      "28": 77,
      "29": 222,
      "30": 75,
      "31": 192,
      "32": 81,
      "33": 71,
      "34": 72,
      "35": 70,
      "1A": 90,
      "1B": 87,
      "1F": 85,
      "2C": 221,
      "2D": 89,
      "2E": 88,
      "2F": 190
    },
    "kbdgr": {
      "15": 90,
      "27": 192,
      "35": 189,
      "0C": 219,
      "1A": 186,
      "1B": 187,
      "2B": 191,
      "2C": 89
    },
    "kbdgr1": {
      "15": 90,
      "27": 192,
      "35": 189,
      "0C": 219,
      "1A": 186,
      "1B": 187,
      "2B": 191,
      "2C": 89
    },
    "kbdgre1": {
      "15": 90,
      "27": 192,
      "35": 189,
      "0C": 219,
      "1A": 186,
      "1B": 187,
      "2B": 191,
      "2C": 89
    },
    "kbdgre2": {
      "15": 90,
      "27": 192,
      "35": 189,
      "0C": 219,
      "1A": 186,
      "1B": 187,
      "2B": 191,
      "2C": 89
    },
    "kbdit": {
      "27": 192,
      "29": 220,
      "35": 189,
      "0C": 219,
      "0D": 221,
      "1A": 186,
      "1B": 187,
      "2B": 191
    },
    "kbdit142": {
      "27": 192,
      "29": 220,
      "35": 189,
      "0C": 219,
      "0D": 221,
      "1A": 186,
      "1B": 187,
      "2B": 191
    },
    "kbdjpn": {},
    "kbdkor": {},
    "kbdla": {
      "27": 192,
      "29": 220,
      "35": 189,
      "0C": 219,
      "0D": 221,
      "1B": 187,
      "2B": 191
    },
    "kbdpl": {
      "15": 90,
      "35": 189,
      "0C": 187,
      "0D": 191,
      "2C": 89
    },
    "kbdpl1": {},
    "kbdpo": {
      "27": 192,
      "29": 220,
      "35": 189,
      "0C": 219,
      "0D": 221,
      "1A": 187
    },
    "kbdsf": {
      "15": 90,
      "27": 222,
      "28": 220,
      "29": 191,
      "35": 189,
      "0C": 219,
      "1A": 186,
      "2B": 223,
      "2C": 89
    },
    "kbdsg": {
      "15": 90,
      "27": 222,
      "28": 220,
      "29": 191,
      "35": 189,
      "0C": 219,
      "1A": 186,
      "2B": 223,
      "2C": 89
    },
    "kbdsp": {
      "27": 192,
      "29": 220,
      "35": 189,
      "0C": 219,
      "0D": 221,
      "1B": 187,
      "2B": 191
    },
    "kbdtuf": {
      "10": 70,
      "11": 71,
      "12": 186,
      "13": 73,
      "14": 79,
      "15": 68,
      "16": 82,
      "17": 78,
      "18": 72,
      "20": 69,
      "21": 65,
      "22": 221,
      "23": 84,
      "24": 75,
      "25": 77,
      "27": 89,
      "30": 191,
      "31": 90,
      "32": 83,
      "33": 66,
      "35": 188,
      "0C": 187,
      "0D": 189,
      "1A": 81,
      "1B": 87,
      "1E": 85,
      "1F": 219,
      "2B": 88,
      "2C": 74,
      "2D": 220,
      "2E": 86,
      "2F": 67
    },
    "kbdtuq": {
      "33": 191,
      "34": 220,
      "35": 190,
      "0C": 223,
      "0D": 189,
      "2B": 188
    },
    "kbdus": {}
  }
}
```

</details>

The returned structure can be used for different lookup scenarios. If you are using the Windows APIs to get the current keyboard layout, you'll probably be getting it as a KLID. Therefore you can do a two-step lookup with the above data: (1) get the driver from the KLID; (2) get the VK Overrides from the driver.

## Resources

- Keyboard Layout data: https://kbdlayout.info
- Table of Windows Languages and IDs: https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/available-language-packs-for-windows
- Table mapping languages to default keyboard layouts on Windows: https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-input-locales-for-windows-language-packs
- Microsoft's list of layouts: https://learn.microsoft.com/en-us/globalization/windows-keyboard-layouts

## Sample Projects

To see how you would use the Windows APIs to get the KLID for the user's current keyboard layout, see:

- Sample Rust project: [./rust-kbd-layout](./rust-kbd-layout)
- Sample CPP project: [./cpp-kbd-layout](./cpp-kbd-layout)

In both cases we use the Windows `GetKeyboardLayoutNameA` method to get the current KLID.
