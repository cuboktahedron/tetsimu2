import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormLabel
} from "@material-ui/core";
import {
  changeConfig,
  resetReplayConfigToDefault,
  saveReplayConfig
} from "ducks/replay/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { RootContext } from "../App";

const useStyles = useSidePanelStyles();

type SettingProps = {
  opens: boolean;
};

const Settings: React.FC<SettingProps> = (props) => {
  if (!props.opens) {
    return null;
  }

  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.replay;
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

  const handleShowTraceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeConfig({
        ...config,
        showsTrace: e.target.checked,
      })
    );
  };

  const handlePassesAllToSimu = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeConfig({
        ...config,
        passesAllToSimu: e.target.checked,
      })
    );
  };

  const handleDefaultClick = () => {
    dispatch(resetReplayConfigToDefault());
  };

  const handleSaveClick = () => {
    dispatch(saveReplayConfig(state.config));
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
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsTrace}
              onChange={handleShowTraceChange}
            />
          }
          label="Show trace"
        />
      </div>
      <Divider />
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Replay Info
        </FormLabel>
      </div>
      <ul>
        <li>Nexts: {state.replayInfo.nextNum}</li>
        <li>Offset range: {state.replayInfo.offsetRange}</li>
        <li>Simulator type: {state.config.strategy}</li>
      </ul>
      <Divider />
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Other
        </FormLabel>
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.config.passesAllToSimu}
              onChange={handlePassesAllToSimu}
            />
          }
          label="Pass all to simu"
        />
      </div>

      <Divider />

      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDefaultClick}
            >
              Default
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveClick}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
