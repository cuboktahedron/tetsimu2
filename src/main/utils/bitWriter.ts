class BitWriter {
  private bitLength: number = 0;
  private buffer: Uint8Array = new Uint8Array(256);

  write(bitLength: number, value: number) {
    if (bitLength > 30) {
      throw Error(
        "Parameter 'bitLength' must be less or equal 30." +
          "This restriction is for safe bit operation."
      );
    }

    let restBitLength = bitLength;
    while (restBitLength > 0) {
      const bi = Math.floor(this.bitLength / 8);
      if (bi >= this.buffer.length) {
        const prevBuffer = this.buffer;
        this.buffer = new Uint8Array(this.buffer.length * 2);
        this.buffer.set(prevBuffer, 0);
      }

      const restOfBitOfByte = 8 - (this.bitLength % 8);
      if (restBitLength <= restOfBitOfByte) {
        this.buffer[bi] += value << (restOfBitOfByte - restBitLength);
        this.bitLength += restBitLength;
        restBitLength = 0;
      } else {
        this.buffer[bi] += value >> (restBitLength - restOfBitOfByte);
        this.bitLength += restOfBitOfByte;
        restBitLength -= restOfBitOfByte;
        value = value & ((1 << restBitLength) - 1);
      }
    }
  }

  get data(): Uint8Array {
    const byteLength = Math.ceil(this.bitLength / 8);
    return this.buffer.slice(0, byteLength);
  }

  get length(): number {
    return this.bitLength;
  }
}

export default BitWriter;
