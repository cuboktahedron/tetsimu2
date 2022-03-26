import { Grid, makeStyles } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import React from "react";
import { useTranslation } from "react-i18next";
import { AttackType, PlayStats } from "types/core";

const useStyles = makeStyles({
  container: {
    "& > :nth-child(odd)": {
      background: blue[700],
      color: "white",
      marginBottom: 4,
    },

    "& > :nth-child(even)": {
      background: blue[300],
      color: "white",
      marginBottom: 4,
      textAlign: "right",
    },
  },
});

export type CounterStatsProps = {
  stats: PlayStats;
};

const CounterStats: React.FC<CounterStatsProps> = (props) => {
  const stats = props.stats;
  const classes = useStyles();
  const { t } = useTranslation();

  const attacks = stats.attacks.reduce((acc, cur) => acc + cur, 0);

  return (
    <div>
      <Grid container spacing={1} className={classes.container}>
        <Grid item xs={6}>
          {t("Stats.Drops")}
        </Grid>
        <Grid item xs={6}>
          {stats.drops.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.Lines")}
        </Grid>
        <Grid item xs={6}>
          {stats.lines.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.Single")}
        </Grid>
        <Grid item xs={6}>
          {stats[AttackType.Single].toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.Double")}
        </Grid>
        <Grid item xs={6}>
          {stats[AttackType.Double].toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.Triple")}
        </Grid>
        <Grid item xs={6}>
          {stats[AttackType.Triple].toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.Tetris")}
        </Grid>
        <Grid item xs={6}>
          {(
            stats[AttackType.Tetris] + stats[AttackType.BtbTetris]
          ).toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.TSpinMini")}
        </Grid>
        <Grid item xs={6}>
          {(stats[AttackType.Tsm] + stats[AttackType.BtbTsm]).toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.TSpinMiniDouble")}
        </Grid>
        <Grid item xs={6}>
          {(
            stats[AttackType.Tsdm] + stats[AttackType.BtbTsdm]
          ).toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.TSpinSingle")}
        </Grid>
        <Grid item xs={6}>
          {(stats[AttackType.Tss] + stats[AttackType.BtbTss]).toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.TSpinDouble")}
        </Grid>
        <Grid item xs={6}>
          {(stats[AttackType.Tsd] + stats[AttackType.BtbTsd]).toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.TSpinTriple")}
        </Grid>
        <Grid item xs={6}>
          {(stats[AttackType.Tst] + stats[AttackType.BtbTst]).toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.PerfectClear")}
        </Grid>
        <Grid item xs={6}>
          {stats[AttackType.PerfectClear].toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.MaxRen")}
        </Grid>
        <Grid item xs={6}>
          {stats.maxRen.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.BackToBack")}
        </Grid>
        <Grid item xs={6}>
          {stats.totalBtb.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.TotalAttack")}
        </Grid>
        <Grid item xs={6}>
          {attacks.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.AttackPerDrop")}
        </Grid>
        <Grid item xs={6}>
          {stats.drops === 0 ? "-" : (attacks / stats.drops).toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.TotalHold")}
        </Grid>
        <Grid item xs={6}>
          {stats.totalHold.toLocaleString()}
        </Grid>
        <Grid item xs={6}>
          {t("Stats.HoldPerDrop")}
        </Grid>
        <Grid item xs={6}>
          {stats.drops === 0
            ? "-"
            : (stats.totalHold / stats.drops).toLocaleString()}
        </Grid>
      </Grid>
    </div>
  );
};

export default CounterStats;
