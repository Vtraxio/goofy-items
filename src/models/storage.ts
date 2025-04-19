import { Item } from "./item";

export class Storage {
  items: Item[];
  capacity: number;
  maxWeight: number;
  itemCount = 0;

  constructor(capacity: number, maxWeight: number) {
    this.capacity = capacity;
    this.maxWeight = maxWeight;
    this.items = [];
  }

  addItem(item: Item): boolean {
    if (this.itemCount == this.capacity) {
      console.log("Adding this item would exceed the warehouse capacity.");
      return false;
    }

    const weights = this.items.map((v) => v.weightKg);
    const totalWeight = weights.reduce((acc, v) => acc + v, 0);
    if (totalWeight + item.weightKg > this.maxWeight)  {
      console.log("Adding this item would exceed the warehouse maximum weight.");
      return false;
    }

    this.items.push(item);
    this.itemCount++;

    console.log("Item added.");
    return true;
  }

  dumpAllDescriptions(): void {
    for (const item of this.items) {
      console.log(item.description());
    }
  }
}
