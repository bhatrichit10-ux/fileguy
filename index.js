#!/usr/bin/env node
import * as p from "@clack/prompts";
import * as fs from "node:fs";
import * as path from "node:path";
import boxen from "boxen";
import readDir from "./src/readDir.js";
import { highlight } from "cli-highlight";  
p.updateSettings({
  aliases: {
    w: "up",
    s: "down",
    a: "left",
    d: "right",
  },
});

function cleanContent(content) {
  return content
    .replace(/\r/g, "")      
    .replace(/\t/g, "    ");  // ts removes windows glitches with ascii
}

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

    if (!selected) continue;

    const fullPath = path.join(process.cwd(), selected);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      process.chdir(fullPath);
      continue;
    }

    if (stats.isFile()) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = cleanContent(content);

      process.stdout.write("\x1Bc") // clear console

      const termWidth = process.stdout.columns || 80;

      const boxed = boxen(highlight(content), {
        padding: 1,
        borderStyle: "classic",
        width: Math.min(termWidth - 2, 120),
        wordWrap: true,
      });

      console.log(boxed);

      const confirmt = await p.confirm({
        message: "Press enter to go back",
        initialValue: true,
      });
      if (confirmt) {
        console.log("\x1Bc") 
        process.exit(0)
    }
  }
}
}
main()