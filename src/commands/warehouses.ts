import { Context, ICommand } from "./core/command";
import console from "node:console";
import { prettyTable, PrettyTableStatus } from "../utils/prettyTable";
import { ArgsReader } from "../utils/args";

export class Warehouses implements ICommand {
  name = "warehouses";

  available(ctx: Context): [boolean, string?] {
    if (ctx.warehouses.length === 0) {
      return [false, "No warehouses exist."];
    }
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Shows a list of all warehouses.

warehouses [page]
\t- page: What page to view.
`;
    } else {
      return "Shows a list of all warehouses.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    const vArg = new ArgsReader(args);

    const page = vArg.extractNum();

    if (page === undefined) {
      console.log("Invalid arguments given.");
      return false;
    }

    const warehouses = ctx.warehouses.map((x) => {
      return {
        name: x.name,
        capacity: x.capacity,
        items: x.itemCount,
        maxWeight: x.maxWeight,
        weight: x.items.reduce((acc, v) => acc + v.weightKg, 0),
      };
    });

    const [success, error] = prettyTable(warehouses, page, 15);

    if (error === PrettyTableStatus.InvalidPage) console.log("Page does not exist.");

    return success;
  }
}
