import { Storage } from "../../models/storage";
import { Exit } from "../exit";
import { Help } from "../help";
import { AddItem } from "../addItem";
import { ListItems } from "../listItems";
import { CmdListExe } from "../cmdListExe";
import { DeleteItem } from "../deleteItem";
import { ListItemsEx } from "../listItemsEx";
import { AvgWeird } from "../avgWeird";
import { AddWarehouse } from "../addWarehouse";
import { SelectWarehouse } from "../selectWarehouse";
import { Warehouses } from "../warehouses";
import { SepCmd } from "./sepCmd";

export const commandRegistry: ICommand[] = [
  new SepCmd("Program Control:"),
  new Exit(),
  new Help(),
  new SepCmd("\nWarehouse Management:"),
  new AddWarehouse(),
  new SelectWarehouse(),
  new Warehouses(),
  new SepCmd("\nItem Management:"),
  new AddItem(),
  new DeleteItem(),
  new SepCmd("\nItem Viewing:"),
  new ListItems(),
  new ListItemsEx(),
  new AvgWeird(),
  new SepCmd("\nCommand Automation:"),
  new CmdListExe(),
];

export interface ICommand {
  name: string;

  help(extended: boolean): string;

  available(ctx: Context): [boolean, string?];

  run(args: string[], ctx: Context): boolean;
}

export interface Context {
  warehouses: Storage[];
  selected_warehouse?: Storage;
  stopRequested: boolean;
}
