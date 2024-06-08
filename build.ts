import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { unique } from "npm:radash";
import { resolve } from "jsr:@std/path";
import denoJson from "./deno.json" with { type: "json" };

const removeSuffixAndPrefix = (str: string, suffix: string, prefix: string) => {
  let res = str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
  res = res.startsWith(prefix) ? res.slice(prefix.length) : res;
  return res;
};

const capitalizeAndRemoveSize = (str: string) => {
  return str.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .filter((s) => !s.match(/\d\d/)).join("");
};

const parser = new DOMParser();

const iconDirs = await Array.fromAsync(
  Deno.readDir("./fluentui-system-icons/assets"),
);

const icons = await Promise.all(
  unique(iconDirs, (p) => p.name.toLowerCase()).filter((p) => p.isDirectory)
    .map((p) =>
      Promise.all(
        [
          p.name,
          Array.fromAsync(
            Deno.readDir(
              resolve("fluentui-system-icons", "assets", p.name, "SVG"),
            ),
          ).then(
            (files) => unique(files, (f) => f.name.match(/[^_]\.svg$/)![0]),
          ),
        ],
      )
    ),
);

const files = unique(
  icons.map(([dir, files]) =>
    files.map((f) =>
      [
        capitalizeAndRemoveSize(
          removeSuffixAndPrefix(f.name, ".svg", "ic_fluent_"),
        ),
        `./fluentui-system-icons/assets/${dir}/SVG/${f.name}`,
      ] as [iconName: string, file: string]
    )
  ).flat(),
  ([name]) => name.toLowerCase(),
);

try {
  Deno.mkdirSync("./icons");
} catch {}

const buffer: Record<string, string[]> = {};
const iconsExports: string[] = [];

for (const [iconName, file] of files) {
  const svg = parser.parseFromString(await Deno.readTextFile(file), "text/html")!.body.firstElementChild!;

  const d = svg.querySelector("path")?.getAttribute("d");
  const viewBox = svg.getAttribute("viewBox")!;

  const _iconName = iconName.replace(/(Filled|Regular)$/, "");

  const iconContent = `export const ${iconName}: FluentIcon = createIcon("${d}", "${viewBox}");`;

  if (!buffer[_iconName]?.length) {
    buffer[_iconName] = ['import { createIcon, bundleIcon, type FluentIcon } from "../core.tsx";', iconContent];
  } else {
    buffer[_iconName].push(iconContent);
    buffer[_iconName].push(
      `export const ${_iconName}: FluentIcon = bundleIcon(${_iconName}Filled, ${_iconName}Regular);`,
    );
    await Deno.writeTextFile(`./icons/${_iconName}.ts`, buffer[_iconName].join("\n"));
    delete buffer[_iconName];

    iconsExports.push(`./icons/${_iconName}.ts`);
  }
}

const exports = { ".": "./core.tsx" }
for (const ic of iconsExports) {
  // @ts-expect-error:
  exports[ic] = ic;
  // @ts-expect-error:
  denoJson.exports = exports
}

Deno.writeTextFileSync("deno.json", JSON.stringify(denoJson, null, 4) );
