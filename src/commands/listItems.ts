import { command, Context, ICommand } from "./core/command";
import console from "node:console";
import { ArgsReader } from "../utils/args";

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

list_items (ugly_view)
\t- ugly_view: If true items will be displayed in the ugly way. (optional) (default: true)
`;
    } else {
      return "Shows all items in the default warehouse.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    const vArg = new ArgsReader(args);

    const uglyView = vArg.extractBool(true);

    if (uglyView === undefined) {
      console.log("Invalid arguments given.");
      return false;
    }

    if (uglyView) {
      ctx.warehouse.dumpAllDescriptions();
    } else {
      const items = ctx.warehouse.items;
      const maxIndexLength = (items.length - 1).toString().length;
      const maxNameLength = Math.max(...items.map((x) => x.name.length), 4);
      const maxWeightLength = Math.max(...items.map((x) => x.weightKg.toString().length), 6);

      console.log(
        `${"#".padEnd(maxIndexLength)}  ${"Name".padEnd(maxNameLength)}  ${"Weight".padEnd(maxWeightLength)}  Weirdness  Fragile`,
      );
      items.forEach((v, i) => {
         console.log(
          `${i.toString().padEnd(maxIndexLength)}  ${v.name.padEnd(maxNameLength)}  ${v.weightKg.toString().padEnd(maxWeightLength)}  ${v.weirdness.toString().padEnd(9)}  ${v.fragile.toString().padEnd(7)}`,
        );
      })
    }

    return true;
  }
}
