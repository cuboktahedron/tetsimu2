import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { AttackType, BtbState } from "types/core";

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

type PlayLogProps = {
  attackTypes: AttackType[];
  btbState: BtbState;
  ren: number;
};

const PlayLog = React.memo<PlayLogProps>((props) => {
  const { attackTypes, btbState, ren } = props;
  const classes = useStyles();

  const logContents: string[] = [];
  if (btbState !== BtbState.None) {
    logContents.push("BtB: ON");
  }
  if (ren >= 1) {
    logContents.push(`${ren} Ren`);
  }

  logContents.push(...attackTypes.map((attackType) => attackLogs[attackType]));

  const playLogs = logContents.map((logContent, index) => (
    <p className={classes.playLog} key={index}>
      {logContent}
    </p>
  ));

  return <div className={classes.root}>{playLogs}</div>;
});

export default PlayLog;
