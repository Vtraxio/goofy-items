import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Context } from "./commands/core/command";
import { execute } from "./interfaces/terminal";
import console from "node:console";
import * as fs from "node:fs";
import path from "node:path";
import "./interfaces/hono";
import { InterfaceMode } from "./utils";
import { serve } from "@hono/node-server";
import { api } from "./interfaces/hono";

export const context: Context = {
  warehouses: [],
  stopRequested: false,
};

const mode: InterfaceMode = InterfaceMode.Web;

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  process.on("SIGUSR2", () => {
    rl.close();
    process.exit();
  });

  const testFiles = fs.readdirSync(path.resolve("test"), { withFileTypes: true }).filter((x) => x.isFile());
  if (testFiles.length > 0) {
    const ans =
      mode === InterfaceMode.Console
        ? await rl.question(
            `Execute ${testFiles.length.toString()} test ${testFiles.length > 1 ? "files" : "file"}? (y/n) > `,
          )
        : "y";
    if (ans === "y") {
      for (const testFile of testFiles) {
        const fullDir = path.resolve(path.join("test", testFile.name));
        execute(`cmd_list_exe "${fullDir}"`, context);
      }
    }
  }

  while (!context.stopRequested && mode === InterfaceMode.Console) {
    const cmd = await rl.question("> ");

    if (cmd.trim().length === 0) {
      console.log("You must enter a command!");
      continue;
    }

    const success = execute(cmd, context);

    if (!success) {
      console.log("Command did not finish successfully. :(");
    }
  }

  if (mode === InterfaceMode.Web) {
    serve(api);
  }

  rl.close();
}

void main();
