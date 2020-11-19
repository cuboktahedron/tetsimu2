import {
  Checkbox,
  createStyles,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Theme,
} from "@material-ui/core";
import { changeConfig, clearSimu } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React, { useEffect } from "react";
import { MAX_NEXTS_NUM, TapControllerType } from "types/core";
import { PlayMode } from "types/simu";
import NumberTextField from "../ext/NumberTextField";
import { SimuContext } from "./Simu";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "white",
      flexGrow: 1,
      padding: 8,

      "& > hr": {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
      },
    },

    formControl: {
      minWidth: 120,
    },

    settingGroupTitle: {
      fontWeight: "bold",
      marginTop: "0.5rem",
      marginBottom: "0.5rem",
    },
  })
);

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
        <FormControl>
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
        </FormControl>
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
          label="Show Cycle"
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
            <FormControl style={{ marginRight: 4 }}>
              <NumberTextField
                label="first"
                InputLabelProps={{
                  shrink: true,
                }}
                numberProps={{
                  min: 0,
                  max: 100,
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  change: handleRiseUpRateFirstChange,
                }}
                value={"" + state.config.riseUpRate.first}
                variant="outlined"
                disabled={config.playMode !== PlayMode.Dig}
              />
            </FormControl>
            <FormControl>
              <NumberTextField
                label="second"
                InputLabelProps={{
                  shrink: true,
                }}
                numberProps={{
                  min: 0,
                  max: 100,
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  change: handleRiseUpRateSecondChange,
                }}
                value={"" + state.config.riseUpRate.second}
                variant="outlined"
                disabled={config.playMode !== PlayMode.Dig}
              />
            </FormControl>
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
