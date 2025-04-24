import { Context, ICommand } from "./core/command";

export class AvgWeird implements ICommand {
  name = "avg_weird";

  available(ctx: Context): [boolean, string?] {
    if (!ctx.selected_warehouse) {
      return [false, "No warehouse selected."];
    }
    if (ctx.selected_warehouse.itemCount == 0) {
      return [false, "No items in the warehouse."];
    }
    return [true];
  }

  help(_extended: boolean): string {
    return "Shows the average weirdness of all items in the warehouse.";
  }

  run(_args: string[], ctx: Context): boolean {
    if (!ctx.selected_warehouse) return false;

    console.log(
      `Average weirdness of ${ctx.selected_warehouse.items.length.toString()} items is ${ctx.selected_warehouse.averageWeirdness().toString()}`,
    );

    return true;
  }
}
