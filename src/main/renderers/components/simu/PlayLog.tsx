import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { AttackType, BtbState } from "types/core";

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

type PlayLogProps = {
  attackTypes: AttackType[];
  btbState: BtbState;
  ren: number;
};

const PlayLog = React.memo<PlayLogProps>((props) => {
  const { attackTypes, btbState, ren } = props;
  const classes = useStyles();
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

  const logContents: string[] = [];
  if (btbState !== BtbState.None) {
    logContents.push("BtB");
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
