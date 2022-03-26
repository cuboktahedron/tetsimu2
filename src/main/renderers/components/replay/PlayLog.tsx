import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { AttackType, BtbState } from "types/core";
import { RootContext } from "../App";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      wordBreak: "keep-all",
    },

    playLog: {
      background: "white",
      fontWeight: "bold",
      marginBottom: 0,
      marginTop: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
  })
);

const PlayLog: React.FC = () => {
  const state = React.useContext(RootContext).state.replay;
  const { t } = useTranslation();

  const attackLogs = {
    [AttackType.Single]: t("Common.Tetsimu.Single"),
    [AttackType.Double]: t("Common.Tetsimu.Double"),
    [AttackType.Triple]: t("Common.Tetsimu.Triple"),
    [AttackType.Tetris]: t("Common.Tetsimu.Tetris"),
    [AttackType.Tsm]: t("Common.Tetsimu.TSpinMini"),
    [AttackType.Tsdm]: t("Common.Tetsimu.TSpinMiniDouble"),
    [AttackType.Tss]: t("Common.Tetsimu.TSpinSingle"),
    [AttackType.Tsd]: t("Common.Tetsimu.TSpinDouble"),
    [AttackType.Tst]: t("Common.Tetsimu.TSpinTriple"),
    [AttackType.BtbTetris]: t("Common.Tetsimu.BtbTetris"),
    [AttackType.BtbTsm]: t("Common.Tetsimu.BtbTsm"),
    [AttackType.BtbTsdm]: t("Common.Tetsimu.BtbTsdm"),
    [AttackType.BtbTss]: t("Common.Tetsimu.BtbTss"),
    [AttackType.BtbTsd]: t("Common.Tetsimu.BtbTsd"),
    [AttackType.BtbTst]: t("Common.Tetsimu.BtbTst"),
    [AttackType.PerfectClear]: t("Common.Tetsimu.PerfectClear"),
  };

  const classes = useStyles();

  const logContents: string[] = [];
  if (state.btbState !== BtbState.None) {
    logContents.push("BtB");
  }
  if (state.ren >= 1) {
    logContents.push(`${state.ren} Ren`);
  }

  logContents.push(
    ...state.attackTypes.map((attackType) => attackLogs[attackType])
  );

  const playLogs = logContents.map((logContent, index) => (
    <p className={classes.playLog} key={index}>
      {logContent}
    </p>
  ));

  return <div className={classes.root}>{playLogs}</div>;
};

export default PlayLog;
