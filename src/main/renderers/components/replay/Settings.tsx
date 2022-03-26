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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
          {t("Replay.Settings.Display.Title")}
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
          label={t("Replay.Settings.Display.ShowPivot")}
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
          label={t("Replay.Settings.Display.ShowGhost")}
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
          label={t("Replay.Settings.Display.ShowCycle")}
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
          label={t("Replay.Settings.Display.ShowTrace")}
        />
      </div>
      <Divider />
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          {t("Replay.Settings.ReplayInfo.Title")}
        </FormLabel>
      </div>
      <ul>
        <li>
          {t("Replay.Settings.ReplayInfo.Nexts")}: {state.replayInfo.nextNum}
        </li>
        <li>
          {t("Replay.Settings.ReplayInfo.OffsetRange")}:{" "}
          {state.replayInfo.offsetRange}
        </li>
        <li>
          {t("Replay.Settings.ReplayInfo.SimulatorType")}:{" "}
          {state.config.strategy}
        </li>
      </ul>
      <Divider />
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          {t("Replay.Settings.Other.Title")}
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
          label={t("Replay.Settings.Other.PassAllToSimu")}
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
              {t("Common.Button.Default")}
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveClick}
            >
              {t("Common.Button.Save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
