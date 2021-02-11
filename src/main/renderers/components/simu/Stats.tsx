import { FormLabel } from "@material-ui/core";
import { getStats } from "ducks/simu/selectors";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import CounterStats from "../CounterStats";
import { SimuContext } from "./Simu";

const useStyles = useSidePanelStyles();

const Stats: React.FC = () => {
  const { state } = React.useContext(SimuContext);

  const stats = React.useMemo(() => getStats(state), [state.histories]);
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
