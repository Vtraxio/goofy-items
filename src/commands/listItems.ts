import { command, Context, ICommand } from "./core/command";
import console from "node:console";
import { ArgsReader } from "../utils/args";
import { prettyTable, PrettyTableStatus } from "../utils/prettyTable";

@command
export class ListItems implements ICommand {
  name = "list_items";

  available(ctx: Context): [boolean, string?] {
    if (ctx.warehouse.itemCount == 0) {
      return [false, "No items in the warehouse."];
    }
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Shows all items in the default warehouse.

list_items (page)
\t- page: Prints out a table with a nicer view, on the specified page. (optional)
`;
    } else {
      return "Shows all items in the default warehouse.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    const vArg = new ArgsReader(args);

    const page = vArg.extractNum();

    if (page === undefined) {
      ctx.warehouse.dumpAllDescriptions();
    } else {
      const items = ctx.warehouse.items;
      const [success, error] = prettyTable(items, page, 15);

      if (error === PrettyTableStatus.InvalidPage) console.log("Page does not exist.");

      return success;
    }
    return true;
  }
}
