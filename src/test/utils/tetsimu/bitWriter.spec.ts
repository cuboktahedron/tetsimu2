import BitWriter from "utils/bitWriter";

describe("BitWriter", () => {
  const writer = new BitWriter();

  it("should return empty array", () => {
    expect(writer.data).toEqual(new Uint8Array(0));
    expect(writer.length).toBe(0);
  });

  it("should write", () => {
    writer.write(2, 0b11);
    writer.write(6, 0b111111);
    writer.write(4, 0b1111);
    writer.write(16, 0b1111111111111111);
    writer.write(30, 0b111111111111111111111111111111);

    const expected = new Uint8Array(8);
    expected[0] = 0b11111111;
    expected[1] = 0b11111111;
    expected[2] = 0b11111111;
    expected[3] = 0b11111111;
    expected[4] = 0b11111111;
    expected[5] = 0b11111111;
    expected[6] = 0b11111111;
    expected[7] = 0b11000000;

    expect(writer.data).toEqual(expected);
    expect(writer.length).toBe(58);
  });
});
