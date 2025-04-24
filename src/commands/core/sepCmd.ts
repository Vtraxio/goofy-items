import { Context, ICommand } from "./command";

export class SepCmd implements ICommand {
  name = "";
  separator: string;

  constructor(separator: string) {
    this.separator = separator;
  }

  available(_ctx: Context): [boolean, string?] {
    return [false];
  }

  help(_extended: boolean): string {
    return this.separator;
  }

  run(_args: string[], _ctx: Context): boolean {
    return false;
  }
}