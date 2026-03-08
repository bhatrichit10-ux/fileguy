import * as p from "@clack/prompts";
import * as fs from "node:fs";
import * as path from "node:path";
import boxen from "boxen";
import readDir from "./src/readDir.js";

p.updateSettings({
  aliases: {
    w: "up",
    s: "down",
    a: "left",
    d: "right",
  },
});

async function main() {
  while (true) {
    const filesArray = await readDir(process.cwd());

    const selected = await p.select({
      message: process.cwd(),
      options: [
        { value: "..", label: "../" },
        ...filesArray.map((file) => ({
          value: file,
          label: file,
        })),
      ],
    });

    const fullPath = path.join(process.cwd(), selected);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      process.chdir(fullPath);
      continue;
    }

    if (stats.isFile()) {
      const content = fs.readFileSync(fullPath, "utf8");

      console.clear();

      const width = process.stdout.columns || 80;

      const boxed = boxen(content, {
        padding: 1,
        borderStyle: "classic"
      });

      console.log(boxed);

      await p.confirm({
        message: "Press enter to go back",
        initialValue: true,
      });
    }
  }
}

main();