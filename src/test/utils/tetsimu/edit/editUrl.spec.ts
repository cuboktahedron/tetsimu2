import { FieldCellValue, Tetromino, TetsimuMode } from "types/core";
import EditUrl from "utils/tetsimu/edit/editUrl";
import { makeEditState } from "../testUtils/makeEditState";
import { makeField } from "../testUtils/makeField";
import { makeHold } from "../testUtils/makeHold";

describe("editUrl", () => {
  describe("fromState", () => {
    it("should generate url(v2.00) of states", () => {
      // 0         1         2         3         4         5         6
      // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_
      const state = makeEditState({
        // 7000000007
        // BIN    : DEC : 64
        // -----------------
        // 011100 : 28 : c
        // 000000 :  0 : A
        // 000000 :  0 : A
        // 000000 :  0 : A
        // 000000 :  0 : A
        // 000000 :  0 : A
        // 011100 : 28 : c
        field: makeField("ZNNNNNNNNZ"),

        hold: makeHold(Tetromino.L, false),
        tools: {
          isCellValueMultiSelection: false,
          nextsPattern: "q2 [IJLOSTZ]p3, IJO",
          nextBaseNo: 2,
          noOfCycle: 3,
          selectedCellValues: [FieldCellValue.None],
        },
      });

      const gen = new EditUrl();
      const actual = gen.fromState(state);
      const loc = location.href.replace(/\?.*$/, "");

      const f = "cAAAAAc_";
      const np = "q2_IJLOSTZ.p3IJO";
      const h = "7";
      const nc = "3";
      const nn = "5";
      const m = TetsimuMode.Simu;
      const v = "2.00";
      const expected = `${loc}?f=${f}&np=${np}&h=${h}&nc=${nc}&nn=${nn}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });

    it("should generate url(v2.00) of states", () => {
      const state = makeEditState({
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        nexts: {
          nextNotes: [],
        },
        tools: {
          isCellValueMultiSelection: false,
          nextsPattern: "",
          nextBaseNo: 1,
          noOfCycle: 1,
          selectedCellValues: [FieldCellValue.None],
        },
      });

      const gen = new EditUrl();
      const actual = gen.fromState(state);
      const loc = location.href.replace(/\?.*$/, "");
      const nn = "5";
      const m = TetsimuMode.Simu;
      const v = "2.00";
      const expected = `${loc}?nn=${nn}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });
  });
});
