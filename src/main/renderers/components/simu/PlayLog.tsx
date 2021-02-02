import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { AttackType, BtbState } from "types/core";
import { SimuContext } from "./Simu";

const attackLogs = {
  [AttackType.Single]: "Single",
  [AttackType.Double]: "Double",
  [AttackType.Triple]: "Triple",
  [AttackType.Tetris]: "Tetris",
  [AttackType.Tsm]: "T-Spin Mini",
  [AttackType.Tsdm]: "T-Spin Mini Double",
  [AttackType.Tss]: "T-Spin Single",
  [AttackType.Tsd]: "T-Spin Double",
  [AttackType.Tst]: "T-Spin Triple",
  [AttackType.BtbTetris]: "BtB Tetris",
  [AttackType.BtbTsm]: "BtB T-Spin Mini",
  [AttackType.BtbTsdm]: "BtB T-Spin Mini Double",
  [AttackType.BtbTss]: "BtB T-Spin Single",
  [AttackType.BtbTsd]: "BtB T-Spin Double",
  [AttackType.BtbTst]: "BtB T-Spin Triple",
  [AttackType.PerfectClear]: "Perfect Clear",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},

    playLog: {
      background: "white",
      fontWeight: "bold",
      marginBottom: 0,
      marginTop: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
    },
  })
);

const PlayLog: React.FC = () => {
  const { state } = React.useContext(SimuContext);

  const classes = useStyles();

  const logContents = [...state.attackTypes].map(
    (attackType) => attackLogs[attackType]
  );
  if (state.ren >= 1) {
    logContents.push(`${state.ren} Ren`);
  }
  if (state.btbState !== BtbState.None) {
    logContents.push("BtB: ON");
  }

  const playLogs = logContents.map((logContent, index) => (
    <p className={classes.playLog} key={index}>
      {logContent}
    </p>
  ));

  return <div className={classes.root}>{playLogs}</div>;
};

export default PlayLog;
