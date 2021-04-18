import {
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { Action, TapControllerType } from "types/core";
import { SimuConfig } from "types/simu";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 120,
  },
});

type InputSettingsProps = {
  config: SimuConfig;
  dispatch: React.Dispatch<Action>;
  isTouchDevice: boolean;
};

const InputSettings = React.memo<InputSettingsProps>((props) => {
  const { config, dispatch, isTouchDevice } = props;

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
    if (isTouchDevice) {
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
          Input
        </FormLabel>
        <div>{tapController}</div>
      </div>
    </div>
  );
});

export default InputSettings;
