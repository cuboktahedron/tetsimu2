import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select
} from "@material-ui/core";
import { changeConfig, clearSimu } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React, { useEffect } from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { MAX_NEXTS_NUM, TapControllerType } from "types/core";
import { PlayMode } from "types/simu";
import NumberTextField from "../ext/NumberTextField";
import { SimuContext } from "./Simu";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 120,
  },
});

const Settings: React.FC = () => {
  const { state, dispatch } = React.useContext(SimuContext);
  const config = state.config;
  const [playMode, setPlayMode] = React.useState(config.playMode);

  const handleNextsNumChange = (value: number): void => {
    if (value !== state.config.nextNum) {
      dispatch(
        changeConfig({
          ...config,
          nextNum: value,
        })
      );
    }
  };

  const handleRiseUpRateFirstChange = (value: number): void => {
    if (value !== state.config.riseUpRate.first) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            first: value,
          },
        })
      );
    }
  };

  const handleRiseUpRateSecondChange = (value: number): void => {
    if (value !== state.config.riseUpRate.second) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            second: value,
          },
        })
      );
    }
  };

  const handleGeneratesGarbagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      changeConfig({
        ...config,
        generatesGarbages: e.target.checked,
      })
    );
  };

  const handleGenerateGarbagesLevelChange = (value: number): void => {
    if (value !== state.config.generateGarbagesLevel) {
      dispatch(
        changeConfig({
          ...config,
          generateGarbagesLevel: value,
        })
      );
    }
  };

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

  const handleTapControllerTypeChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      changeConfig({
        ...config,
        tapControllerType: e.target.value as TapControllerType,
      })
    );
  };

  const handlePlayModeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(
      changeConfig({
        ...config,
        playMode: e.target.value as PlayMode,
      })
    );
  };

  useEffect(() => {
    if (playMode !== state.config.playMode) {
      dispatch(clearSimu(getSimuConductor(state)));
      setPlayMode(state.config.playMode);
    }
  }, [state.config.playMode]);

  const classes = useStyles();
  const tapController = (() => {
    if (state.env.isTouchDevice) {
      return (
        <FormControl className={classes.formControl}>
          <InputLabel id="tap-controller-type-label">Tap Controller</InputLabel>
          <Select
            labelId="tap-controller-type-label"
            id="tap-controller-type"
            onChange={handleTapControllerTypeChange}
            value={config.tapControllerType}
          >
            <MenuItem value={TapControllerType.None}>None</MenuItem>
            <MenuItem value={TapControllerType.TypeA}>TypeA</MenuItem>
            <MenuItem value={TapControllerType.TypeB}>TypeB</MenuItem>
          </Select>
        </FormControl>
      );
    } else {
      return (
        <FormControl className={classes.formControl}>
          <InputLabel id="tap-controller-type-label">Tap Controller</InputLabel>
          <Select
            labelId="tap-controller-type-label"
            id="tap-controller-type"
            value={config.tapControllerType}
            disabled
          >
            <MenuItem value={TapControllerType.None}>None</MenuItem>
          </Select>
        </FormControl>
      );
    }
  })();

  return (
    <div className={classes.root}>
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Display
        </FormLabel>
        <NumberTextField
          label="Nexts"
          numberProps={{
            min: 1,
            max: MAX_NEXTS_NUM,
            change: handleNextsNumChange,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          value={"" + state.config.nextNum}
          variant="outlined"
        />
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

      <Divider />

      <div>
        <FormGroup>
          <FormLabel component="legend" className={classes.settingGroupTitle}>
            Play Mode
          </FormLabel>
          <RadioGroup value={config.playMode} onChange={handlePlayModeChange}>
            <FormControlLabel
              value={PlayMode.Normal}
              control={<Radio />}
              label="Normal"
            />
            <FormControlLabel
              value={PlayMode.Dig}
              control={<Radio />}
              label="Dig"
            />
          </RadioGroup>
          <div>
            <div>Rise up rate</div>
            <NumberTextField
              label="first"
              InputLabelProps={{
                shrink: true,
              }}
              numberProps={{
                min: 0,
                max: 100,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                change: handleRiseUpRateFirstChange,
              }}
              value={"" + state.config.riseUpRate.first}
              variant="outlined"
              disabled={config.playMode !== PlayMode.Dig}
              style={{ marginRight: 4 }}
            />
            <NumberTextField
              label="second"
              InputLabelProps={{
                shrink: true,
              }}
              numberProps={{
                min: 0,
                max: 100,
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                change: handleRiseUpRateSecondChange,
              }}
              value={"" + state.config.riseUpRate.second}
              variant="outlined"
              disabled={config.playMode !== PlayMode.Dig}
            />
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={config.generatesGarbages}
                  onChange={handleGeneratesGarbagesChange}
                />
              }
              label="Generates garbages"
            />
          </div>
          <div>
            <NumberTextField
              label="level"
              InputLabelProps={{
                shrink: true,
              }}
              numberProps={{
                min: 0,
                max: 9999,
                change: handleGenerateGarbagesLevelChange,
              }}
              value={"" + state.config.generateGarbagesLevel}
              variant="outlined"
              disabled={!state.config.generatesGarbages}
            />
          </div>
        </FormGroup>
      </div>

      <Divider />

      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Input
        </FormLabel>
        <div>{tapController}</div>
      </div>
    </div>
  );
};

export default Settings;
