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
    if (this.itemCount == this.capacity) return false;

    const weights = this.items.map((v) => v.weightKg);
    const totalWeight = weights.reduce((acc, v) => acc + v);
    if (totalWeight + item.weightKg > this.maxWeight) return false;

    this.items.push(item);
    this.itemCount++;

    console.log("Dodano przedmiot");
    return true;
  }

  dumpAllDescriptions(): void {
    for (const item of this.items) {
      console.log(item.description());
    }
  }
}
