import { FormLabel } from "@material-ui/core";
import { getStats } from "ducks/simu/selectors";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { RootContext } from "../App";
import CounterStats from "../CounterStats";

const useStyles = useSidePanelStyles();

type StatsProps = {
  opens: boolean;
};

const Stats: React.FC<StatsProps> = (props) => {
  if (!props.opens) {
    return null;
  }

  const { state: rootState } = React.useContext(RootContext);
  const state = rootState.simu;

  const stats = React.useMemo(() => getStats(state), [state.step]);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormLabel component="legend" className={classes.settingGroupTitle}>
        Stats
      </FormLabel>
      <CounterStats stats={stats} />
    </div>
  );
};

export default Stats;
