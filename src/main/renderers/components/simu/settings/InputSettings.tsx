import {
  Button,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import clsx from "clsx";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { initialSimuState, SimuState } from "stores/SimuState";
import { Action, TapControllerType } from "types/core";
import { InputConfig, KeyConfig } from "types/simu";

const useStyles = useSidePanelStyles({
  root2: {
    border: "solid 1px grey",
    display: "none",
    padding: 8,
  },

  opens: {
    display: "block",
  },

  formControl: {
    minWidth: 120,
  },
});

type InputSettingsProps = {
  dispatch: React.Dispatch<Action>;
  stateRef: React.MutableRefObject<SimuState>;
  input: InputConfig;
  opens: boolean;
};

const InputSettings = React.memo<InputSettingsProps>((props) => {
  const dispatch = props.dispatch;
  const state = props.stateRef.current;

  const handleTapControllerTypeChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      changeConfig({
        ...state.config,
        input: {
          ...props.input,
          tapControllerType: e.target.value as TapControllerType,
        },
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

    if (props.input.keys[key] === e.nativeEvent.code) {
      return;
    }

    dispatch(
      changeConfig({
        ...state.config,
        input: {
          ...props.input,
          keys: {
            ...props.input.keys,
            [key]: e.nativeEvent.code,
          },
        },
      })
    );
  };

  const handleDefaultClick = () => {
    dispatch(
      changeConfig({
        ...state.config,
        input: { ...initialSimuState.config.input },
      })
    );
  };

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
            value={props.input.tapControllerType}
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
            value={props.input.tapControllerType}
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
        key: props.input.keys.hardDrop,
        label: "hard drop",
        name: "hardDrop",
      },
      {
        key: props.input.keys.moveLeft,
        label: "move left",
        name: "moveLeft",
      },
      {
        key: props.input.keys.moveRight,
        label: "move right",
        name: "moveRight",
      },
      {
        key: props.input.keys.softDrop,
        label: "soft drop",
        name: "softDrop",
      },
      {
        key: props.input.keys.rotateLeft,
        label: "rotate left",
        name: "rotateLeft",
      },
      {
        key: props.input.keys.rotateRight,
        label: "rotate right",
        name: "rotateRight",
      },
      {
        key: props.input.keys.hold,
        label: "hold",
        name: "hold",
      },
      {
        key: props.input.keys.back,
        label: "back",
        name: "back",
      },
    ];

    if (state.env.isTouchDevice) {
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
  }, [props.input, state.env.isTouchDevice]);

  return (
    <div
      className={clsx(classes.root2, {
        [classes.opens]: props.opens,
      })}
    >
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          Input
        </FormLabel>
        <div>{tapController}</div>
      </div>
      <div className={classes.section}>{keyConfig}</div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDefaultClick}
        >
          Default
        </Button>
      </div>
    </div>
  );
});

type KeyConfigType = {
  key: string;
  label: string;
  name: keyof KeyConfig;
};

export default InputSettings;
