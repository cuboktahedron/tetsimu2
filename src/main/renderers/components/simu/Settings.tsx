import {
  Button,
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
import {
  changeConfig,
  changeGarbageLevel,
  clearSimu,
  resetSimuConfigToDefault,
  saveSimuConfig
} from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React, { useEffect } from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { MAX_NEXTS_NUM, TapControllerType } from "types/core";
import { PlayMode } from "types/simu";
import { RootContext } from "../App";
import NumberTextField from "../ext/NumberTextField";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 120,
  },
});

const Settings: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.simu;
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

  const handleOffsetRangeChange = (value: number) => {
    dispatch(
      changeConfig({
        ...config,
        offsetRange: value,
      })
    );
  };

  const handleGeneratesGarbagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      changeConfig({
        ...config,
        garbage: {
          ...state.config.garbage,
          generates: e.target.checked,
        },
      })
    );
  };

  const handleGenerateGarbagesLevelChange = (value: number): void => {
    if (value !== state.config.garbage.level) {
      dispatch(changeGarbageLevel(value));
    }
  };

  const handleGenerateGarbageFactorChange = (
    paramName: keyof typeof config.garbage,
    value: number
  ): void => {
    if (value !== state.config.garbage[paramName]) {
      dispatch(
        changeConfig({
          ...config,
          garbage: {
            ...config.garbage,
            level: null,
            [paramName]: value,
          },
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

  const handleDefaultClick = () => {
    dispatch(resetSimuConfigToDefault());
  };

  const handleSaveClick = () => {
    dispatch(saveSimuConfig(state.config));
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
          <InputLabel id="tap-controller-type-label">tap controller</InputLabel>
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
          <InputLabel id="tap-controller-type-label">tap controller</InputLabel>
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
          label="nexts"
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
        </FormGroup>
      </div>

      <Divider />

      <div>
        <div>
          <FormLabel component="legend" className={classes.settingGroupTitle}>
            Garbage
          </FormLabel>

          <div className={classes.section}>
            <NumberTextField
              label="first rate"
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
              style={{ marginRight: 4 }}
            />
            <NumberTextField
              label="second rate"
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
            />
          </div>
        </div>
        <div className={classes.section}>
          <NumberTextField
            className={classes.formControl}
            label="offset range"
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 0,
              max: 12,
              change: handleOffsetRangeChange,
            }}
            value={"" + state.config.offsetRange}
            variant="outlined"
            style={{ minWidth: 120 }}
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={config.garbage.generates}
                onChange={handleGeneratesGarbagesChange}
              />
            }
            label="Generate garbages"
          />
        </div>
        <div className={classes.section}>
          <NumberTextField
            label="level"
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 0,
              max: 100,
              change: handleGenerateGarbagesLevelChange,
            }}
            value={
              state.config.garbage.level !== null
                ? "" + state.config.garbage.level
                : ""
            }
            variant="outlined"
            disabled={!state.config.garbage.generates}
          />
        </div>
        <div>factors</div>
        <div className={classes.section}>
          <NumberTextField
            label="a1"
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 0,
              max: 150,
              change: (value) => handleGenerateGarbageFactorChange("a1", value),
            }}
            value={"" + state.config.garbage.a1}
            variant="outlined"
            disabled={!state.config.garbage.generates}
            style={{ marginRight: 4 }}
          />
          <NumberTextField
            label="a2"
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 1,
              max: 100,
              change: (value) => handleGenerateGarbageFactorChange("a2", value),
            }}
            value={"" + state.config.garbage.a2}
            variant="outlined"
            disabled={!state.config.garbage.generates}
            style={{ marginRight: 4 }}
          />
          <NumberTextField
            label="b1"
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 0,
              max: 150,
              change: (value) => handleGenerateGarbageFactorChange("b1", value),
            }}
            value={"" + state.config.garbage.b1}
            variant="outlined"
            disabled={!state.config.garbage.generates}
            style={{ marginRight: 4 }}
          />
          <NumberTextField
            label="b2"
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 1,
              max: 100,
              change: (value) => handleGenerateGarbageFactorChange("b2", value),
            }}
            value={"" + state.config.garbage.b2}
            variant="outlined"
            disabled={!state.config.garbage.generates}
          />
        </div>
      </div>

      <Divider />

      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Input
        </FormLabel>
        <div>{tapController}</div>
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
