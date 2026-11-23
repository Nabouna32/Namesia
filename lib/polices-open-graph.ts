import { readFile } from "node:fs/promises";
import { join } from "node:path";

let policesEnCache: Promise<NonNullable<ConstructorParameters<typeof import("next/og").ImageResponse>[1]>["fonts"]> | undefined;

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
