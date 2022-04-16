import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select
} from "@material-ui/core";
import { changeConfig, clearSimu } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { SimuState } from "stores/SimuState";
import { Action } from "types/core";
import { PlayMode, SimuConfig } from "types/simu";
import { SimulatorStrategyType } from "utils/SimulationStrategyBase";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 160,
  },
});

type PlayModeSettingsProps = {
  config: SimuConfig;
  dispatch: React.Dispatch<Action>;
  stateRef: React.MutableRefObject<SimuState>;
};

const PlayModeSettings = React.memo<PlayModeSettingsProps>((props) => {
  const { config, dispatch } = props;
  const [playMode, setPlayMode] = React.useState(config.playMode);
  const { t } = useTranslation();

  const handlePlayModeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(
      changeConfig({
        ...config,
        playMode: e.target.value as PlayMode,
      })
    );
  };

  React.useLayoutEffect(() => {
    if (playMode !== config.playMode) {
      dispatch(clearSimu(getSimuConductor(props.stateRef.current)));
      setPlayMode(config.playMode);
    }
  }, [config.playMode]);

  const handleSimulatorTypeChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      changeConfig({
        ...config,
        strategy: e.target.value as SimulatorStrategyType,
      })
    );
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FormGroup>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          {t("Simu.Settings.PlayMode.Title")}
        </FormLabel>
        <RadioGroup value={config.playMode} onChange={handlePlayModeChange}>
          <FormControlLabel
            value={PlayMode.Normal}
            control={<Radio />}
            label={t("Simu.Settings.PlayMode.Mode.Normal")}
          />
          <FormControlLabel
            value={PlayMode.Dig}
            control={<Radio />}
            label={t("Simu.Settings.PlayMode.Mode.Dig")}
          />
        </RadioGroup>
      </FormGroup>
      <FormControl className={classes.formControl}>
        <InputLabel id="simulator-type-label">
          {t("Simu.Settings.PlayMode.SimulatorType")}
        </InputLabel>
        <Select
          labelId="simulator-type-label"
          id="simulator-type"
          onChange={handleSimulatorTypeChange}
          value={config.strategy}
        >
          <MenuItem value={SimulatorStrategyType.Pytt2}>
            {SimulatorStrategyType.Pytt2}
          </MenuItem>
          <MenuItem value={SimulatorStrategyType.Pytt2V132}>
            {SimulatorStrategyType.Pytt2V132}
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
});

export default PlayModeSettings;
