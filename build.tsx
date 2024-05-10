import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { unique } from "npm:radash";
import { resolve } from "jsr:@std/path";

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

const variables: string[] = ['import type { JSX } from "preact";'];

for (const [iconName, file] of files) {
  const svg = parser.parseFromString(
    await Deno.readTextFile(file),
    "text/html",
  )!.body.firstElementChild!;

  const d = svg.querySelector("path")?.getAttribute("d");
  const viewBox = svg.getAttribute("viewBox")!;

  const iconContent = `
export function ${iconName}({ width, height, ...props }: JSX.HTMLAttributes<SVGSVGElement>): JSX.Element {
  return (
    <svg
      {...props}
      width={width}
      height={height}
      viewBox="${viewBox}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="${d}" fill="currentColor" />
    </svg>
  );
}`;

  variables.push(iconContent);
}

await Deno.writeTextFile(
  "mod.tsx",
  variables.join("\n"),
);
