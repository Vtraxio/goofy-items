import { Context, ICommand } from "./core/command";
import { ArgsReader } from "../utils/args";
import console from "node:console";
import { Storage } from "../models/storage";

export class AddWarehouse implements ICommand {
  name = "add_warehouse";

  available(_ctx: Context): [boolean, string?] {
    return [true];
  }

  help(extended: boolean): string {
    if (extended) {
      return `
Adds a new warehouse.

add_warehouse [name] [capacity] [max_weight] (auto_select)
\t- name: Unique name of the warehouse, will fail if repeats.
\t- capacity: Item capacity of the warehouse.
\t- max_weight: Maximum weight that the warehouse can hold.
\t- auto_select: Automatically select the created warehouse.

NOTE: If your string has spaces you must wrap is in an apostrophe.
`;
    } else {
      return "Adds a new warehouse.";
    }
  }

  run(args: string[], ctx: Context): boolean {
    const vArg = new ArgsReader(args);

    const name = vArg.extractString();
    const capacity = vArg.extractNum();
    const maxWeight = vArg.extractNum();
    const autoSelect = vArg.extractBool(false);

    if (name === undefined || capacity === undefined || maxWeight === undefined || autoSelect === undefined) {
      console.log("Invalid arguments given.");
      return false;
    } else if (capacity < 0) {
      console.log("Capacity must be more than 0");
      return false;
    } else if (!Number.isInteger(capacity)) {
      console.log("Capacity must be an integer.");
      return false;
    } else if (maxWeight < 0) {
      console.log("Max weight must be more than 0");
      return false;
    }

    const warehouse = new Storage(name, capacity, maxWeight);
    ctx.warehouses.push(warehouse);

    if (autoSelect) ctx.selected_warehouse = warehouse;

    console.log("Added warehouse.");

    return true;
  }
}
