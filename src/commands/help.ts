import { commandRegistry, Context, ICommand } from "./core/command";
import { styleText } from "node:util";

export class Help implements ICommand {
  name = "help";

  available(_ctx: Context): [boolean, string?] {
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Shows the help for all commands.

help - Shows all help.
help [command] - Shows help for the specified command.
`;
    } else {
      return "Shows the help for all commands.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    if (args.length === 0) {
      const maxNameLength = Math.max(...commandRegistry.map((x) => x.name.length));

      for (const command of commandRegistry) {
        if (command.name === ""){
          console.log(command.help(false));
          continue;
        }

        const [available] = command.available(ctx);
        console.log(
          `${command.name.padEnd(maxNameLength)} - ${command.help(false)}${available ? "" : styleText("red", " (n/a)")}`,
        );
      }

      return true;
    }

    const command = commandRegistry.find((x) => x.name === args[0]);

    if (!command) {
      console.log("Specified command not found.");
      return false;
    }

    console.log(`${command.name} - ${command.help(true).trim()}`);

    return true;
  }
}
