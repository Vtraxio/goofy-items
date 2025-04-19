import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { takeSafeNumber } from "./utils";
import { Storage } from "./models/storage";
import { commandRegistry, Context } from "./commands/core/command";
import { Exit } from "./commands/exit";
import { Help } from "./commands/help";

new Exit();
new Help();

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

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
      continue;
    }

    const fragments = cmd.split(" ");

    const command = commandRegistry.find((x) => x.name === fragments[0]);

    if (!command) {
      console.log("Command not found.");
      continue;
    }

    const [available, error] = command.available(context);
    if (!available) {
      if (error) {
        console.log("Command not available in the current state:");
        for (const line of error.split("\n")) {
          console.log(`\t${line}`);
        }
      } else {
        console.log("Command not available in the current state.");
      }
      continue;
    }

    const success = command.run(fragments.slice(1), context);

    if (!success) {
      console.log("Command did not finish successfully. :(");
    }
  }

  rl.close();
}

void main();
