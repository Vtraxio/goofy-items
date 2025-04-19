import { command, Context, ICommand } from "./core/command";

@command
export class AvgWeird implements ICommand {
  name = "avg_weird";

  available(ctx: Context): [boolean, string?] {
    if (ctx.warehouse.itemCount == 0) {
      return [false, "No items in the warehouse."];
    }
    return [true];
  }

  help(_extended: boolean): string {
    return "Shows the average weirdness of all items in the warehouse.";
  }

  run(_args: string[], ctx: Context): boolean {
    console.log(
      `Average weirdness of ${ctx.warehouse.items.length.toString()} items is ${ctx.warehouse.averageWeirdness().toString()}`,
    );

    return true;
  }
}
