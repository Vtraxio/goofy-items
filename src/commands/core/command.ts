import { Storage } from "../../models/storage";

export const commandRegistry: ICommand[] = [];

export function command(target: new (...args: never[]) => ICommand): void {
  const instance = new target();
  commandRegistry.push(instance);
}

export interface ICommand {
  name: string;

  help(extended: boolean): string;

  available(ctx: Context): [boolean, string?];

  run(args: string[], ctx: Context): boolean;
}

export interface Context {
  warehouse: Storage;
  stopRequested: boolean;
}
