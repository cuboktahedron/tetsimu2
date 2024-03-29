import { System } from "constants/System";
import { FieldCellValue, Tetromino, TetsimuMode } from "types/core";
import EditUrl, { EditStateFragments } from "utils/tetsimu/edit/editUrl";
import { makeEditState } from "../testUtils/makeEditState";
import { makeField } from "../testUtils/makeField";
import { makeHold } from "../testUtils/makeHold";

describe("editUrl", () => {
  describe("fromState", () => {
    it("should generate url of states", () => {
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
          nextsPattern: "q2 [IJLOSTZ]p3, IJO$",
          nextBaseNo: 2,
          noOfCycle: 3,
          selectedCellValues: [FieldCellValue.None],
        },
      });

      const gen = new EditUrl();
      const actual = gen.fromState(state);
      const loc = location.href.replace(/\?.*$/, "");

      const f = "cAAAAAc_";
      const np = "q2_IJLOSTZ.p3IJO-";
      const h = "7";
      const nc = "3";
      const nn = "5";
      const m = TetsimuMode.Simu;
      const v = System.Version;
      const expected = `${loc}?f=${f}&np=${np}&h=${h}&nc=${nc}&nn=${nn}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });

    it("should generate url of minimum states", () => {
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
      const v = System.Version;
      const expected = `${loc}?nn=${nn}&m=${m}&v=${v}`;
      expect(actual).toBe(expected);
    });
  });

  describe("toState", () => {
    it("should generate states from url(v2.01 <= v) with np", () => {
      const f = "EjRWeBI0VngA";
      const h = "3";
      const nc = "6";
      const np = "q2_IJ.p2LOS-";
      const m = `${TetsimuMode.Edit}`;
      const surl = "http://localhost/test.json";
      const v = "2.04";

      const params = {
        f,
        h,
        nc,
        np,
        m,
        surl,
        v,
      };
      const gen = new EditUrl();
      const actual = gen.toState(params);

      const expected: EditStateFragments = {
        field: makeField(
          // prettier-ignore
          "NNIJLOSTZG",
          "IJLOSTZGNN"
        ),
        hold: makeHold(Tetromino.I, false),
        nextsPattern: "q2[IJ]p2LOS$",
        numberOfCycle: 6,
        syncUrl: "http://localhost/test.json",
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url(v2.01 <= v) with ns", () => {
      const ns = "Kcu4";
      const m = `${TetsimuMode.Edit}`;
      const v = "2.03";

      const params = {
        ns,
        m,
        v,
      };
      const gen = new EditUrl();
      const actual = gen.toState(params);

      const expected: EditStateFragments = {
        field: makeField(
          // prettier-ignore
          "NNNNNNNNNN"
        ),
        hold: makeHold(Tetromino.None, true),
        nextsPattern: "IJLOSTZ",
        numberOfCycle: 1,
        syncUrl: "",
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url with no params", () => {
      const gen = new EditUrl();
      const actual = gen.toState({});

      const expected: EditStateFragments = {
        field: makeField("NNNNNNNNNN"),
        hold: makeHold(Tetromino.None, true),
        nextsPattern: "",
        numberOfCycle: 1,
        syncUrl: "",
      };

      expect(actual).toEqual(expected);
    });

    it("should generate states from url(v = 0.97)", () => {
      const f = "04zhmu918QlDyg";
      const ns = "a0s6E";
      const h = "5";
      const s = "3";
      const m = `${TetsimuMode.Edit}`;
      const v = "0.97";

      const params = {
        f,
        ns,
        h,
        m,
        s,
        v,
      };
      const gen = new EditUrl();
      const actual = gen.toState(params);

      const expected: EditStateFragments = {
        field: makeField(
          // prettier-ignore
          "NIJLOSTZGG",
          "IJLOSTZGGN"
        ),
        hold: makeHold(Tetromino.J, false),
        numberOfCycle: 1,
        nextsPattern: "IJq1q1LOq1TS",
        syncUrl: "",
      };

      expect(actual).toEqual(expected);
    });
  });
});
