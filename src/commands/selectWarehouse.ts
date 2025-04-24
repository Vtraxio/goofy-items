import { Context, ICommand } from "./core/command";
import { ArgsReader } from "../utils/args";
import console from "node:console";
import { normalize } from "../utils";

export class SelectWarehouse implements ICommand {
  name = "select_warehouse";

  available(ctx: Context): [boolean, string?] {
    if (ctx.warehouses.length === 0) {
      return [false, "No warehouses exist."];
    }
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Selects a warehouse to use for all future operations.

select_warehouse [name]
\t- name: Name of the warehouse to select.

The name doesn't have to match exactly, the following transformations
are performed before internally comparing the strings:
\t- Trim whitespace characters.
\t- Lowercase everything.
\t- Remove spaces.
\t- Remove letter diacritics, e.g. ę -> e.

NOTE: If your string has spaces you must wrap is in an apostrophe.
`;
    } else {
      return "Selects a warehouse to use for all future operations.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    const vArg = new ArgsReader(args);

    const name = vArg.extractString();

    if (name === undefined) {
      console.log("Invalid arguments given.");
      return false;
    }

    const safeName = normalize(name);
    const warehouse = ctx.warehouses.find((x) => normalize(x.name) === safeName);

    if (!warehouse) {
      console.log("Warehouse not found.");
      return false;
    }

    ctx.selected_warehouse = warehouse;

    console.log(`Selected warehouse ${warehouse.name}`);

    return true;
  }
}
