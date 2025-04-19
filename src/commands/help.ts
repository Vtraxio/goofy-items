import { command, commandRegistry, Context, ICommand } from "./core/command";

@command
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

  run(args: string[], _ctx: Context): boolean {
    if (args.length === 0) {
      const maxNameLength = Math.max(...commandRegistry.map((x) => x.name.length));

      for (const command of commandRegistry) {
        console.log(`${command.name.padEnd(maxNameLength)} - ${command.help(false)}`);
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
