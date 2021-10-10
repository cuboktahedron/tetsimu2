import { Pytt2Strategy } from "./pytt2Strategy";

const renTable = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5];

export class Pytt2V132Strategy extends Pytt2Strategy {
  get renTable() {
    return renTable;
  }
}
