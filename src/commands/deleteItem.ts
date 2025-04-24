import { Context, ICommand } from "./core/command";
import { ArgsReader } from "../utils/args";
import console from "node:console";

export class DeleteItem implements ICommand {
  name = "delete_item";

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
Deletes the first item with the specified name.

delete_item [name]
\t- name: Name of the item to delete.

The name doesn't have to match exactly, the following transformations
are performed before internally comparing the strings:
\t- Trim whitespace characters.
\t- Lowercase everything.
\t- Remove spaces.
\t- Remove letter diacritics, e.g. ę -> e.

NOTE: If your string has spaces you must wrap is in an apostrophe.
`;
    } else {
      return "Deletes the first item with the specified name.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    if (!ctx.selected_warehouse) return false;

    const vArg = new ArgsReader(args);

    const name = vArg.extractString();

    if (name === undefined) {
      console.log("Invalid arguments given.");
      return false;
    }

    ctx.selected_warehouse.deleteItem(name);

    return true;
  }
}
