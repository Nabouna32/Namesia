import { readFile } from "node:fs/promises";
import { join } from "node:path";

type PoliceOpenGraph = {
  name: string;
  data: ArrayBuffer;
  weight: 400;
  style: "normal";
};

let policesEnCache: Promise<PoliceOpenGraph[]> | undefined;

export function chargerPolicesOpenGraph() {
  policesEnCache ??= readFile(
    join(process.cwd(), "assets", "fonts", "Roboto-Regular.ttf.base64"),
    "utf8"
  ).then((contenu) => {
    const police = Buffer.from(contenu, "base64");
    const donnees = police.buffer.slice(
      police.byteOffset,
      police.byteOffset + police.byteLength
    ) as ArrayBuffer;

    return [{
      name: "Roboto",
      data: donnees,
      weight: 400 as const,
      style: "normal" as const
    }];
  });

  return policesEnCache;
}
