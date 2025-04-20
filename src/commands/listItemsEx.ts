import { command, Context, ICommand } from "./core/command";
import console from "node:console";
import { ArgsReader } from "../utils/args";
import { prettyTable, PrettyTableStatus } from "../utils/prettyTable";

@command
export class ListItemsEx implements ICommand {
  name = "list_items_ex";

  available(ctx: Context): [boolean, string?] {
    if (!ctx.selected_warehouse) {
      return [false, "No warehouse selected."];
    }
    if (ctx.selected_warehouse.itemCount == 0) {
      return [false, "No items in the warehouse."];
    }
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Shows all items in the default warehouse that are both
fragile and meet the weight requirement.

list_items_ex [weight_requirement] (page)
\t- weight_requirement: The minimum weight an item must have to be displayed.
\t- page: Prints out a table with a nicer view, on the specified page. (optional)
`;
    } else {
      return "Shows all items with a specific condition (read extended).";
    }
  }

  run(args: string[], ctx: Context): boolean {
    if (!ctx.selected_warehouse) return false;

    const vArg = new ArgsReader(args);

    const weightMin = vArg.extractNum();
    const page = vArg.extractNum();

    if (weightMin === undefined) {
      console.log("Invalid arguments given.");
      return false;
    }

    if (page === undefined) {
      ctx.selected_warehouse.listFragileOrHeavy(weightMin);
    } else {
      const items = ctx.selected_warehouse.items.filter((x) => x.fragile || x.weightKg > weightMin);
      const [success, error] = prettyTable(items, page, 15);

      if (error === PrettyTableStatus.InvalidPage) console.log("Page does not exist.");

      return success;
    }

    return true;
  }
}
