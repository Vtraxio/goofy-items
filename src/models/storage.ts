import { Item } from "./item";
import { normalize } from "../utils";
import cuid from "cuid";

export class Storage {
  items: Item[];
  cuid: string;
  name: string;
  capacity: number;
  maxWeight: number;
  itemCount = 0;

  constructor(name: string, capacity: number, maxWeight: number) {
    this.cuid = cuid();
    this.name = name;
    this.capacity = capacity;
    this.maxWeight = maxWeight;
    this.items = [];
  }

  addItem(item: Item): [boolean, string?] {
    if (this.itemCount == this.capacity) {
      return [false, "Adding this item would exceed the warehouse capacity."];
    }

    const totalWeight = this.items.reduce((acc, v) => acc + v.weightKg, 0);
    if (totalWeight + item.weightKg > this.maxWeight) {
      return [false, "Adding this item would exceed the warehouse maximum weight."];
    }

    if (item.weirdness === 7 && item.fragile && this.capacity / 2 <= this.itemCount) {
      return [false, "Item too risky to store at current item count."];
    }

    this.items.push(item);
    this.itemCount++;

    return [true];
  }

  deleteItem(name: string): boolean {
    const safeName = normalize(name);
    const idx = this.items.findIndex((x) => normalize(x.name) === safeName);

    if (idx === -1) {
      console.log("Item not found.");
      return false;
    }

    const item = this.items[idx];

    if (!item) {
      // Because this should never happen.
      console.log("Unknown error.");
      return false;
    }

    this.items.splice(idx, 1);
    this.itemCount--;
    console.log(`Deleted item ${item.name}`);

    return true;
  }

  listFragileOrHeavy(minWeight: number): void {
    for (const item of this.items.filter((x) => x.fragile || x.weightKg > minWeight)) {
      console.log(item.description());
    }
  }

  averageWeirdness(): number {
    if (this.itemCount === 0) return 0;

    return this.items.reduce((acc, v) => acc + v.weightKg, 0) / this.itemCount;
  }

  dumpAllDescriptions(): void {
    for (const item of this.items) {
      console.log(item.description());
    }
  }
}
