import {
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { Action, TapControllerType } from "types/core";
import { KeyConfig, SimuConfig } from "types/simu";

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

  const handleKeyChange = (
    key: keyof KeyConfig,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey || e.key === "Tab") {
      return;
    }

    if (config.keys[key] === e.nativeEvent.code) {
      return;
    }

    dispatch(
      changeConfig({
        ...config,
        keys: {
          ...config.keys,
          [key]: e.nativeEvent.code,
        },
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

  const keyConfig = React.useMemo(() => {
    const keys: KeyConfigType[] = [
      {
        key: config.keys.hardDrop,
        label: "hard drop",
        name: "hardDrop",
      },
      {
        key: config.keys.moveLeft,
        label: "move left",
        name: "moveLeft",
      },
      {
        key: config.keys.moveRight,
        label: "move right",
        name: "moveRight",
      },
      {
        key: config.keys.softDrop,
        label: "soft drop",
        name: "softDrop",
      },
      {
        key: config.keys.rotateLeft,
        label: "rotate left",
        name: "rotateLeft",
      },
      {
        key: config.keys.rotateRight,
        label: "rotate right",
        name: "rotateRight",
      },
      {
        key: config.keys.hold,
        label: "hold",
        name: "hold",
      },
      {
        key: config.keys.back,
        label: "back",
        name: "back",
      },
    ];

    if (isTouchDevice) {
      return <div />;
    } else {
      return keys.map((key: KeyConfigType, i: number) => {
        return (
          <TextField
            key={i}
            fullWidth
            label={key.label}
            InputLabelProps={{
              shrink: true,
            }}
            value={key.key}
            variant="outlined"
            onKeyDown={(e) => handleKeyChange(key.name, e)}
          />
        );
      });
    }
  }, [config.keys, isTouchDevice]);

  return (
    <div className={classes.root}>
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Input
        </FormLabel>
        <div>{tapController}</div>
      </div>
      <div className={classes.section}>{keyConfig}</div>
    </div>
  );
});

type KeyConfigType = {
  key: string;
  label: string;
  name: keyof KeyConfig;
};

export default InputSettings;
