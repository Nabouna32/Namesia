import { readFile } from "node:fs/promises";
import { join } from "node:path";

type PoliceOpenGraph = {
  name: string;
  data: Buffer;
  weight: 400;
  style: "normal";
};

let policesEnCache: Promise<PoliceOpenGraph[]> | undefined;

export function chargerPolicesOpenGraph() {
  policesEnCache ??= readFile(
    join(process.cwd(), "assets", "fonts", "Roboto-Regular.ttf.base64"),
    "utf8"
  ).then((contenu) => [{
    name: "Roboto",
    data: Buffer.from(contenu, "base64"),
    weight: 400 as const,
    style: "normal" as const
  }]);

  return policesEnCache;
}
