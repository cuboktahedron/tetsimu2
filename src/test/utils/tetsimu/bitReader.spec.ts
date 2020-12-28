import BitReader from "utils/bitReader";

describe("BitReader", () => {
  it("should read", () => {
    const bytes = new Uint8Array(8);
    bytes[0] = 0b00000001;
    bytes[1] = 0b00010001;
    bytes[2] = 0b00100010;
    bytes[3] = 0b00110011;
    bytes[4] = 0b01000100;
    bytes[5] = 0b01010101;
    bytes[6] = 0b01100110;
    bytes[7] = 0b01110111;

    const reader = new BitReader(bytes);
    expect(reader.read(2)).toBe(0b00);
    expect(reader.read(6)).toBe(0b000001);
    expect(reader.read(4)).toBe(0b0001);
    expect(reader.read(16)).toBe(0b0001_00100010_0011);
    expect(reader.read(30)).toBe(0b0011_01000100_01010101_01100110_01);
    expect(reader.read(5)).toBe(0b11011);
    expect(reader.eof).toBeFalsy();
    expect(reader.read(1)).toBe(0b1);
    expect(reader.eof).toBeTruthy();
  });

  it("should be thrown Error due to be beyond boundary", () => {
    const bytes = new Uint8Array(1);
    const reader = new BitReader(bytes);
    reader.read(7);
    reader.read(1);
    expect(() => reader.read(1)).toThrowError(
      "Can't read bytes beyond array boundary."
    );
  });
});
