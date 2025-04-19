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

new Exit();
new Help();
new AddItem();
new ListItems();
new CmdListExe();

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
