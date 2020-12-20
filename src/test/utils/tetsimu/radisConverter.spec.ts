import RadixConverter from "utils/radixConverter";

describe("RadixConverter", () => {
  const converter = new RadixConverter(64);

  describe("convertFromDecimal", () => {
    it("should convert decimal to 64-base number", function () {
      expect(converter.convertFromDecimal(139)).toBe("2b");
    });

    it("should convert 64-base number to decimal", function () {
      expect(converter.convertToDecimal("2b")).toBe(139);
    });
  });
});
