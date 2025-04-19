import console from "node:console";
import { camelCaseToWords } from "./index";

export enum PrettyTableStatus {
  Empty,
  InvalidPage,
}

export function prettyTable(items: object[], page: number, pageSize: number): [boolean, PrettyTableStatus?] {
  const maxIndexLength = (items.length - 1).toString().length;

  // https://stackoverflow.com/questions/42761068/paginate-javascript-array
  const paginated = items.slice(page * pageSize, (page + 1) * pageSize);

  if (paginated.length === 0) {
    return [false, PrettyTableStatus.InvalidPage];
  }

  if (items.length === 0) {
    return [false, PrettyTableStatus.Empty];
  }

  const map = new Map<string, number>();

  for (const item of items) {
    for (const [k, v] of Object.entries(item)) {
      const length = (v as string).toString().length;
      if (!map.has(k)) {
        map.set(k, camelCaseToWords(k).length);
      }
      const curr = map.get(k);
      if ((curr ?? 0) < length) {
        map.set(k, length);
      }
    }
  }

  console.log(`${items.length.toString()} total items.\n`);

  const rowDef = ["#".padEnd(maxIndexLength)];

  map.forEach((v, k) => {
    rowDef.push(camelCaseToWords(k).padEnd(v));
  });

  console.log(rowDef.join("  "));

  paginated.forEach((v, i) => {
    const row = [(i + page * pageSize).toString().padEnd(maxIndexLength)];

    Object.entries(v).forEach(([k, v]) => {
      row.push((v as string).toString().padEnd(map.get(k) ?? 0));
    });

    console.log(row.join("  "));
  });
  console.log(`(Page ${page.toString()} of ${Math.floor(items.length / 15).toString()})`);

  return [true];
}
