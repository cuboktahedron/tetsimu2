const BaseChars =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
const BaseCharsToNum = (() => {
  const charsToNum: { [key: string]: number } = {};

  BaseChars.split("").forEach((baseChar, index) => {
    charsToNum[baseChar] = index;
  });

  return charsToNum;
})();

class RadixConverter {
  constructor(private base: number) {}

  convertFromDecimal(decimal: number) {
    let base64Number = "";
    do {
      const p = Math.floor(decimal / this.base);
      const q = decimal % this.base;
      base64Number = BaseChars.charAt(q) + base64Number;
      decimal = p;
    } while (decimal > 0);

    return base64Number;
  }

  convertToDecimal(base64Number: string) {
    return base64Number
      .split("")
      .map((c) => BaseCharsToNum[c])
      .reduce((acc, cur, index) => {
        if (index !== 0) {
          acc *= this.base;
        }
        return acc + cur;
      });
  }
}

export default RadixConverter;
