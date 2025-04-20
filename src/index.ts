import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { Context } from "./commands/core/command";
import { Exit } from "./commands/exit";
import { Help } from "./commands/help";
import { AddItem } from "./commands/addItem";
import { ListItems } from "./commands/listItems";
import { execute } from "./interfaces/terminal";
import { CmdListExe } from "./commands/cmdListExe";
import console from "node:console";
import * as fs from "node:fs";
import path from "node:path";
import { DeleteItem } from "./commands/deleteItem";
import { ListItemsEx } from "./commands/listItemsEx";
import { AvgWeird } from "./commands/avgWeird";
import { AddWarehouse } from "./commands/addWarehouse";
import { SelectWarehouse } from "./commands/selectWarehouse";
import { Warehouses } from "./commands/warehouses";
import "./interfaces/hono";

new Exit();
new Help();
new AddItem();
new ListItems();
new CmdListExe();
new DeleteItem();
new ListItemsEx();
new AvgWeird();
new AddWarehouse();
new SelectWarehouse();
new Warehouses();

export const context: Context = {
  warehouses: [],
  stopRequested: false,
};

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  process.on("SIGUSR2", () => {
    rl.close();
    process.exit();
  });

  const testFiles = fs.readdirSync(path.resolve("test"), { withFileTypes: true }).filter((x) => x.isFile());
  if (testFiles.length > 0) {
    // const ans = await rl.question(
    //   `Execute ${testFiles.length.toString()} test ${testFiles.length > 1 ? "files" : "file"}? (y/n) > `,
    // );
    // if (ans === "y") {
    for (const testFile of testFiles) {
      const fullDir = path.resolve(path.join("test", testFile.name));
      execute(`cmd_list_exe "${fullDir}"`, context);
    }
    // }
  }

  // while (!context.stopRequested) {
  //   const cmd = await rl.question("> ");
  //
  //   if (cmd.trim().length === 0) {
  //     console.log("You must enter a command!");
  //     return false;
  //   }
  //
  //   const success = execute(cmd, context);
  //
  //   if (!success) {
  //     console.log("Command did not finish successfully. :(");
  //   }
  // }
  //

  await Promise.resolve();
  console.log();
  rl.close();
}

void main();
