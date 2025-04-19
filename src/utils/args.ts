export class ArgsReader {
  private args: string[];
  private position = 0;

  constructor(args: string[]) {
    this.args = args;
  }

  extractString(): string | undefined {
    // The reason we need to do this extra code instead of trimming the empty fields.
    // Is because we need to preserve the space information if the user wraps a string in
    // apostrophes.
    const firstReal = this.args.slice(this.position).findIndex((x) => x);
    if (firstReal != -1) this.position += firstReal;
    const clamped = this.args.slice(this.position);

    if (!clamped[0]) return undefined;

    let str = "";

    // First char contains apostrophe.
    const firstChar = clamped[0].slice(0, 1);
    if (['"', "'"].includes(firstChar)) {
      // Continuously add the fragments until we find the opposing apostrophe.
      let first = true;
      for (const string of clamped) {
        str += string;
        this.position++;
        if (string.slice(-1) === firstChar && (!first || string.length > 1)) {
          break;
        }
        str += " ";
        first = false;
      }

      str = str.slice(1, -1);
    } else {
      str = clamped[0];
      this.position++;
    }

    return str;
  }

  extractNum(): number | undefined {
    const firstReal = this.args.slice(this.position).findIndex((x) => x);
    if (firstReal != -1) this.position += firstReal;
    const clamped = this.args.slice(this.position);

    if (!clamped[0]) return undefined;

    const converted = Number(clamped[0]);

    if (!isNaN(converted)) {
      this.position++;
      return converted;
    } else {
      return undefined;
    }
  }

  extractBool(def = false): boolean | undefined {
    const firstReal = this.args.slice(this.position).findIndex((x) => x);
    if (firstReal != -1) this.position += firstReal;
    const clamped = this.args.slice(this.position);

    if (!clamped[0]) return def;

    if (clamped[0] === "true") {
      this.position++;
      return true;
    } else if (clamped[0] === "false") {
      this.position++;
      return false;
    }
    return undefined;
  }
}
