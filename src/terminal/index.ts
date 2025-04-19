import { commandRegistry, Context } from "../commands/core/command";

export function execute(cmd: string, ctx: Context): boolean {
  const fragments = cmd.split(" ");

  const command = commandRegistry.find((x) => x.name === fragments[0]);

  if (!command) {
    console.log("Command not found.");
    return false;
  }

  const [available, error] = command.available(ctx);
  if (!available) {
    if (error) {
      console.log("Command not available in the current state:");
      for (const line of error.split("\n")) {
        console.log(`\t${line}`);
      }
    } else {
      console.log("Command not available in the current state.");
    }
    return false;
  }

  return command.run(fragments.slice(1), ctx);
}
