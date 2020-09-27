import { OperationKey } from "utils/tetsimu/operationKey";
import { sleep } from "utils/function";

describe("OperationKey", () => {
  it("should return active state", async () => {
    const key = new OperationKey({
      interval1: 50,
      interval2: 100,
    });

    key.down();
    key.refresh();
    expect(key.active).toBeTruthy();

    await sleep(30);
    key.refresh();
    expect(key.active).toBeFalsy();

    await sleep(30);
    key.refresh();
    expect(key.active).toBeTruthy();

    await sleep(60);
    key.refresh();
    expect(key.active).toBeFalsy();

    await sleep(50);
    key.refresh();
    expect(key.active).toBeTruthy();

    key.up();
    key.refresh();
    expect(key.active).toBeFalsy();
  });
});
