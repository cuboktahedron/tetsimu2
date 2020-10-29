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
  TextField,
  Theme,
} from "@material-ui/core";
import { changeConfig, clearSimu } from "ducks/simu/actions";
import { getSimuConductor } from "ducks/simu/selectors";
import React, { useEffect } from "react";
import { MAX_NEXTS_NUM, TapControllerType } from "types/core";
import { PlayMode } from "types/simu";
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
  const [riseUpRateFirst, setRiseUpRateFirst] = React.useState(
    config.riseUpRate.first + ""
  );
  const [riseUpRateSecond, setRiseUpRateSecond] = React.useState(
    config.riseUpRate.second + ""
  );
  const [textKeys, setTextKeys] = React.useState({
    nextNums: new Date().getTime(),
    riseUpRateFirst: new Date().getTime(),
    riseUpRateSecond: new Date().getTime(),
  });

  const handleNextsNumChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    let value = +e.currentTarget.value;

    if (isNaN(value)) {
      return;
    }

    if (value < 1) {
      value = 1;
    } else if (value > MAX_NEXTS_NUM) {
      value = MAX_NEXTS_NUM;
    }

    if (value !== state.config.nextNum) {
      dispatch(
        changeConfig({
          ...config,
          nextNum: value,
        })
      );
    }
  };

  const handleNextsNumBlur = (): void => {
    setTextKeys({ ...textKeys, nextNums: new Date().getTime() });
  };

  const handleRiseUpRateFirstChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    let value = +e.currentTarget.value;

    if (isNaN(value)) {
      return;
    }

    if (value < 0) {
      value = 0;
    } else if (value > 100) {
      value = 100;
    }

    setRiseUpRateFirst(value + "");
  };

  const handleRiseUpRateFirstKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key !== "Enter") {
      return;
    }

    if (+riseUpRateFirst !== config.riseUpRate.first) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            first: +riseUpRateFirst,
          },
        })
      );
    }
  };

  const handleRiseUpRateFirstBlur = (): void => {
    if (+riseUpRateFirst !== config.riseUpRate.first) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            first: +riseUpRateFirst,
          },
        })
      );

      setTextKeys({ ...textKeys, riseUpRateFirst: new Date().getTime() });
    }
  };

  const handleRiseUpRateSecondChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    let value = +e.currentTarget.value;

    if (isNaN(value)) {
      return;
    }

    if (value < 0) {
      value = 0;
    } else if (value > 100) {
      value = 100;
    }

    setRiseUpRateSecond(value + "");
  };

  const handleRiseUpRateSecondKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key !== "Enter") {
      return;
    }

    if (+riseUpRateSecond !== config.riseUpRate.second) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            second: +riseUpRateSecond,
          },
        })
      );
    }
  };

  const handleRiseUpRateSecondBlur = (): void => {
    if (+riseUpRateSecond !== config.riseUpRate.second) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            second: +riseUpRateSecond,
          },
        })
      );

      setTextKeys({ ...textKeys, riseUpRateSecond: new Date().getTime() });
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
          <TextField
            key={textKeys.nextNums}
            type="number"
            label="Nexts"
            InputProps={{ inputProps: { min: 1, max: MAX_NEXTS_NUM } }}
            InputLabelProps={{
              shrink: true,
            }}
            value={state.config.nextNum}
            variant="outlined"
            onBlur={handleNextsNumBlur}
            onChange={handleNextsNumChange}
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
            <div>
              <div>Rise up rate</div>
              <FormControl style={{ marginRight: 4 }}>
                <TextField
                  key={textKeys.riseUpRateFirst}
                  type="number"
                  label="first"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={riseUpRateFirst}
                  variant="outlined"
                  disabled={config.playMode !== PlayMode.Dig}
                  onBlur={handleRiseUpRateFirstBlur}
                  onChange={handleRiseUpRateFirstChange}
                  onKeyDown={handleRiseUpRateFirstKeyDown}
                />
              </FormControl>
              <FormControl>
                <TextField
                  key={textKeys.riseUpRateSecond}
                  type="number"
                  label="second"
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={riseUpRateSecond}
                  variant="outlined"
                  disabled={config.playMode !== PlayMode.Dig}
                  onBlur={handleRiseUpRateSecondBlur}
                  onChange={handleRiseUpRateSecondChange}
                  onKeyDown={handleRiseUpRateSecondKeyDown}
                />
              </FormControl>
            </div>
          </RadioGroup>
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
