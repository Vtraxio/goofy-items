import readline from "node:readline/promises";

export async function takeSafeNumber(rl: readline.Interface, message: string, min?: number): Promise<number> {
  while (true) {
    const ans = await rl.question(message);
    const num = parseInt(ans);

    if (isNaN(num)) {
      console.log("Enter a valid number!");
      continue;
    }

    if (min !== undefined && num <= min) {
      console.log(`Enter a value larger than ${min.toString()}`);
      continue;
    }

    return num;
  }
}

// https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-title-case-text
export function camelCaseToWords(s: string) {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function normalize(str: string): string {
  return str
    .trim() // Remove any goofy characters at the ends.
    .toLowerCase() // Make sure capitalization does not matter.
    .replace(" ", "") // Make sure spaces don't matter.
    .normalize("NFD") // Split unicode diacritic.
    .replace(/\p{Diacritic}/gu, ""); // Remove isolated diacritics.
}

export enum InterfaceMode {
  Console,
  Web
}