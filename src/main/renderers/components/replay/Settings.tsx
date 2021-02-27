import { Checkbox, FormControlLabel, FormLabel } from "@material-ui/core";
import { changeConfig } from "ducks/replay/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { ReplayContext } from "./Replay";

const useStyles = useSidePanelStyles();

const Settings: React.FC = () => {
  const { state, dispatch } = React.useContext(ReplayContext);
  const config = state.config;

  const handleShowPivotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeConfig({
        ...config,
        showsPivot: e.target.checked,
      })
    );
  };

  const handleShowGhostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeConfig({
        ...config,
        showsGhost: e.target.checked,
      })
    );
  };

  const handleShowCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeConfig({
        ...config,
        showsCycle: e.target.checked,
      })
    );
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Display
        </FormLabel>
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsPivot}
              onChange={handleShowPivotChange}
            />
          }
          label="Show pivot"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsGhost}
              onChange={handleShowGhostChange}
            />
          }
          label="Show ghost"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsCycle}
              onChange={handleShowCycleChange}
            />
          }
          label="Show cycle"
        />
      </div>
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Replay Info
        </FormLabel>
      </div>
      <ul>
        <li>Nexts: {state.replayInfo.nextNum}</li>
        <li>Offset range: {state.replayInfo.offsetRange}</li>
      </ul>
    </div>
  );
};

export default Settings;
