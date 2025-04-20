import { command, Context, ICommand } from "./core/command";
import * as console from "node:console";
import { ArgsReader } from "../utils/args";
import { Item } from "../models/item";

@command
export class AddItem implements ICommand {
  name = "add_item";

  available(ctx: Context): [boolean, string?] {
    if (!ctx.selected_warehouse) {
      return [false, "No warehouse selected."];
    }
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Adds a new item to the default warehouse.

add_item [name] [weight] [weirdness] (fragile)
\t- name: Name of the item.
\t- weight: Weight of the item in kg.
\t- weirdness: Item weirdness on a scale from 1 to 10 (inclusive).
\t- fragile: If the item is fragile. (optional) (default: false)

NOTE: If your string has spaces you must wrap is in an apostrophe.
      `;
    } else {
      return "Adds a new item to the warehouse.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    if (!ctx.selected_warehouse) return false;

    if (args.length === 0) {
      console.log("No arguments specified.");
      return false;
    }

    const vArg = new ArgsReader(args);

    const name = vArg.extractString();
    const weight = vArg.extractNum();
    const weirdness = vArg.extractNum();
    const fragile = vArg.extractBool();

    if (name === undefined || weight === undefined || weirdness === undefined || fragile === undefined) {
      console.log("Invalid arguments given.");
      return false;
    } else if (weight < 0) {
      console.log("Weight must be more than 0.");
      return false;
    } else if (!Number.isInteger(weirdness)) {
      console.log("Weirdness must be an integer.");
      return false;
    } else if (weirdness < 1 || weirdness > 10) {
      console.log("Weirdness must be in a range of <1, 10>.");
      return false;
    }

    const item = new Item(name, weight, weirdness, fragile);
    return ctx.selected_warehouse.addItem(item);
  }
}
