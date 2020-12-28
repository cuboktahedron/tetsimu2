class BitReader {
  private pointer: number = 0;
  private buffer: Uint8Array;

  constructor(bytes: Uint8Array) {
    this.buffer = bytes;
  }

  get eof(): boolean {
    return this.pointer === this.buffer.length * 8;
  }

  read(bitLength: number): number {
    if (bitLength > 30) {
      throw Error(
        "Parameter 'bitLength' must be less or equal 30." +
          "This restriction is for safe bit operation."
      );
    }

    let restBitLength = bitLength;
    let value = 0;
    while (restBitLength > 0) {
      const bi = Math.floor(this.pointer / 8);
      if (bi >= this.buffer.length) {
        throw new Error("Can't read bytes beyond array boundary.");
      }

      const restOfBitOfByte = 8 - (this.pointer % 8);
      if (restBitLength <= restOfBitOfByte) {
        value +=
          (this.buffer[bi] >> (restOfBitOfByte - restBitLength)) &
          ((1 << restBitLength) - 1);
        this.pointer += restBitLength;
        restBitLength = 0;
      } else {
        value +=
          (this.buffer[bi] & ((1 << restOfBitOfByte) - 1)) <<
          (restBitLength - restOfBitOfByte);
        this.pointer += restOfBitOfByte;
        restBitLength -= restOfBitOfByte;
      }
    }

    return value;
  }
}

export default BitReader;
