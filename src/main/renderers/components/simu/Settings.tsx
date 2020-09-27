import {
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import { MAX_NEXTS_NUM, TapControllerType } from "types/core";
import { SimuContext } from "./Simu";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "white",
      flexGrow: 1,
      padding: 8,
    },

    formControl: {
      minWidth: 120,
    },
  })
);

const Settings: React.FC = () => {
  const { state, dispatch } = React.useContext(SimuContext);
  const config = state.config;
  const [nextNum, setNextNum] = React.useState(config.nextNum + "");
  const [textKeys, setTextKeys] = React.useState({
    nextNums: new Date().getTime(),
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

    setNextNum(value + "");
  };

  const handleNextsNumKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key !== "Enter") {
      return;
    }

    if (+nextNum !== config.nextNum) {
      dispatch(
        changeConfig({
          ...config,
          nextNum: +nextNum,
        })
      );
    }
  };

  const handleNextsNumBlur = (): void => {
    if (+nextNum !== config.nextNum) {
      dispatch(
        changeConfig({
          ...config,
          nextNum: +nextNum,
        })
      );

      setTextKeys({ ...textKeys, nextNums: new Date().getTime() });
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
      <TextField
        key={textKeys.nextNums}
        type="number"
        label="Nexts"
        InputProps={{ inputProps: { min: 1, max: MAX_NEXTS_NUM } }}
        InputLabelProps={{
          shrink: true,
        }}
        value={nextNum}
        variant="outlined"
        onBlur={handleNextsNumBlur}
        onChange={handleNextsNumChange}
        onKeyDown={handleNextsNumKeyDown}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsPivot}
              onChange={handleShowPivotChange}
            />
          }
          label="Show pivot"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsGhost}
              onChange={handleShowGhostChange}
            />
          }
          label="Show ghost"
        />
      </FormGroup>
      {tapController}
    </div>
  );
};

export default Settings;
