import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { takeSafeNumber } from "./utils";
import { Storage } from "./models/storage";
import { Context } from "./commands/core/command";
import { Exit } from "./commands/exit";
import { Help } from "./commands/help";
import { AddItem } from "./commands/addItem";
import { ListItems } from "./commands/listItems";
import { execute } from "./terminal";
import { CmdListExe } from "./commands/cmdListExe";
import console from "node:console";
import * as fs from "node:fs";
import path from "node:path";
import { DeleteItem } from "./commands/deleteItem";

new Exit();
new Help();
new AddItem();
new ListItems();
new CmdListExe();
new DeleteItem();

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  process.on("SIGUSR2", () => {
    rl.close();
    process.exit();
  });

  const capacity = await takeSafeNumber(rl, "Enter default warehouse capacity: ", 0);
  const maxWeight = await takeSafeNumber(rl, "Enter default warehouse maximum weight: ", 0);

  const warehouse = new Storage(capacity, maxWeight);

  const context: Context = {
    warehouse: warehouse,
    stopRequested: false,
  };

  const testFiles = fs.readdirSync(path.resolve("test"), { withFileTypes: true }).filter((x) => x.isFile());
  if (testFiles.length > 0) {
    const ans = await rl.question(
      `Execute ${testFiles.length.toString()} test ${testFiles.length > 1 ? "files" : "file"}? (y/n) > `,
    );
    if (ans === "y") {
      for (const testFile of testFiles) {
        const fullDir = path.resolve(path.join("test", testFile.name));
        execute(`cmd_list_exe "${fullDir}"`, context);
      }
    }
  }

  while (!context.stopRequested) {
    const cmd = await rl.question("> ");

    if (cmd.trim().length === 0) {
      console.log("You must enter a command!");
      return false;
    }

    const success = execute(cmd, context);

    if (!success) {
      console.log("Command did not finish successfully. :(");
    }
  }

  rl.close();
}

void main();
