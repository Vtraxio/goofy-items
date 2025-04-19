import { command, Context, ICommand } from "./core/command";
import { ArgsReader } from "../utils/args";
import console from "node:console";
import path from "node:path";
import * as fs from "node:fs";
import { execute } from "../terminal";

@command
export class CmdListExe implements ICommand {
  name = "cmd_list_exe";

  available(_ctx: Context): [boolean, string?] {
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Executes commands from the specified file line by line.

cmd_list_exe [file_name]
\t- file_name: location of the file on the disk.
`;
    } else {
      return "Execute commands from a file.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    const vArg = new ArgsReader(args);

    const fileName = vArg.extractString();

    if (fileName === undefined) {
      console.log("Invalid arguments given.");
      return false;
    }

    const realFileName = path.resolve(fileName);

    try {
      const data = fs.readFileSync(realFileName, "utf8");

      const commands = data.split(/\r?\n/).filter((x) => x.trim().length !== 0);

      for (const cmd of commands) {
        console.log(`> ${cmd}`);
        if (!execute(cmd, ctx)) {
          console.log("Command failed to execute, stopping.");
          return false;
        }
        console.log("All Complete.");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
      return false;
    }

    return true;
  }
}
