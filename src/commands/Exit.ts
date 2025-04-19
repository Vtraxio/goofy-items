import { command, Context, ICommand } from "./core/Command";

@command
export class Exit implements ICommand {
  name = "exit";

  available(_ctx: Context): boolean {
    return true;
  }

  help(_extended: boolean): string {
    return "Stops the program";
  }

  run(_args: string[], ctx: Context): boolean {
    ctx.stopRequested = true;

    return true;
  }
}
