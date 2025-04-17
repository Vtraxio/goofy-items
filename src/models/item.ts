export class Item {
  name: string;
  weightKg: number;
  weirdness: number;
  fragile: boolean;

  constructor(
    name: string,
    weightKg: number,
    weirdness: number,
    fragile: boolean,
  ) {
    this.name = name;
    this.weightKg = weightKg;
    this.weirdness = weirdness;
    this.fragile = fragile;
  }

  description(): string {
    return JSON.stringify(this, null, 2);
  }
}
