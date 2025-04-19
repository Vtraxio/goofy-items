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
    if (totalWeight + item.weightKg > this.maxWeight) {
      console.log("Adding this item would exceed the warehouse maximum weight.");
      return false;
    }

    this.items.push(item);
    this.itemCount++;

    console.log("Item added.");
    return true;
  }

  deleteItem(name: string): boolean {
    const normalize = (str: string): string => {
      return str
        .trim() // Remove any goofy characters at the ends.
        .toLowerCase() // Make sure capitalization does not matter.
        .replace(" ", "") // Make sure spaces don't matter.
        .normalize("NFD") // Split unicode diacritic.
        .replace(/\p{Diacritic}/gu, ""); // Remove isolated diacritics.
    };

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
    if (this.itemCount === 0)
      return 0;

    return this.items.reduce((acc, v) => acc + v.weightKg, 0) / this.itemCount;
  }

  dumpAllDescriptions(): void {
    for (const item of this.items) {
      console.log(item.description());
    }
  }
}
