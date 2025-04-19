import { command, Context, ICommand } from "./core/command";
import console from "node:console";
import { ArgsReader } from "../utils/args";

@command
export class ListItemsEx implements ICommand {
  name = "list_items_ex";

  available(ctx: Context): [boolean, string?] {
    if (ctx.warehouse.itemCount == 0) {
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
    const vArg = new ArgsReader(args);

    const weightMin = vArg.extractNum();
    const page = vArg.extractNum();

    if (weightMin === undefined) {
      console.log("Invalid arguments given.");
      return false;
    }

    if (page === undefined) {
      ctx.warehouse.listFragileOrHeavy(weightMin);
    } else {
      const items = ctx.warehouse.items.filter((x) => x.fragile || x.weightKg > weightMin);
      const maxIndexLength = (items.length - 1).toString().length;

      // https://stackoverflow.com/questions/42761068/paginate-javascript-array
      const paginated = items.slice(page * 15, (page + 1) * 15);
      const maxNameLength = Math.max(...paginated.map((x) => x.name.length), 4);
      const maxWeightLength = Math.max(...paginated.map((x) => x.weightKg.toString().length), 6);

      if (paginated.length === 0) {
        console.log(`Page does not exist, only ${(Math.floor(items.length / 15) + 1).toString()} exist.`);
        return false;
      }

      console.log(`${items.length.toString()} total items.`);
      const weight = items.reduce((acc, v) => acc + v.weightKg, 0);
      console.log(
        `${Math.round(weight).toString()}kg total, (${Math.round(ctx.warehouse.maxWeight - weight).toString()}kg left).\n`,
      );
      console.log(
        `${"#".padEnd(maxIndexLength)}  ${"Name".padEnd(maxNameLength)}  ${"Weight".padEnd(maxWeightLength)}  Weirdness  Fragile`,
      );
      paginated.forEach((v, i) => {
        console.log(
          `${(i + page * 15).toString().padEnd(maxIndexLength)}  ${v.name.padEnd(maxNameLength)}  ${v.weightKg.toString().padEnd(maxWeightLength)}  ${v.weirdness.toString().padEnd(9)}  ${v.fragile.toString().padEnd(7)}`,
        );
      });
      console.log(`(Page ${page.toString()} of ${Math.floor(items.length / 15).toString()})`);
    }

    return true;
  }
}
