import { downReplaySpeed, upReplaySpeed } from "ducks/replay/actions";
import { ChangeReplaySpeedAction, ReplayActionsType } from "ducks/replay/types";

describe("replayModule", () => {
  describe("upReplaySpeed", () => {
    it("should up replay speed to next upper speed", () => {
      const actual = upReplaySpeed(0.25);

      const expected: ChangeReplaySpeedAction = {
        type: ReplayActionsType.ChangeReplaySpeed,
        payload: {
          speed: 0.5,
        },
      };

      expect(actual).toEqual(expected);
      expect(upReplaySpeed(0.5).payload.speed).toBe(0.75);
      expect(upReplaySpeed(0.75).payload.speed).toBe(1);
      expect(upReplaySpeed(1).payload.speed).toBe(1.33);
      expect(upReplaySpeed(1.33).payload.speed).toBe(2);
      expect(upReplaySpeed(2).payload.speed).toBe(4);
      expect(upReplaySpeed(4).payload.speed).toBe(4);
    });
  });

  describe("upReplaySpeed", () => {
    it("should up replay speed to next lower speed", () => {
      const actual = downReplaySpeed(4);

      const expected: ChangeReplaySpeedAction = {
        type: ReplayActionsType.ChangeReplaySpeed,
        payload: {
          speed: 2,
        },
      };

      expect(actual).toEqual(expected);
      expect(downReplaySpeed(2).payload.speed).toBe(1.33);
      expect(downReplaySpeed(1.33).payload.speed).toBe(1);
      expect(downReplaySpeed(1).payload.speed).toBe(0.75);
      expect(downReplaySpeed(0.75).payload.speed).toBe(0.5);
      expect(downReplaySpeed(0.5).payload.speed).toBe(0.25);
      expect(downReplaySpeed(0.25).payload.speed).toBe(0.25);
    });
  });
});
