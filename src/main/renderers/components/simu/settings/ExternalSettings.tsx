import { FormGroup, FormLabel } from "@material-ui/core";
import clsx from "clsx";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import TextFieldEx from "renderers/components/ext/TextFieldEx";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { SimuState } from "stores/SimuState";
import { Action } from "types/core";
import { ExternalConfig } from "types/simu";

const useStyles = useSidePanelStyles({
  root2: {
    border: "solid 1px grey",
    display: "none",
    padding: 8,
  },

  opens: {
    display: "block",
  },
});

type ExternalSettingsProps = {
  dispatch: React.Dispatch<Action>;
  stateRef: React.MutableRefObject<SimuState>;
  external: ExternalConfig;
  opens: boolean;
};

const ExternalSettings = React.memo<ExternalSettingsProps>((props) => {
  const dispatch = props.dispatch;
  const state = props.stateRef.current;
  const classes = useStyles();

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value !== props.external.host) {
      dispatch(
        changeConfig({
          ...state.config,
          external: {
            ...props.external,
            host: value,
          },
        })
      );
    }
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value !== props.external.port) {
      dispatch(
        changeConfig({
          ...state.config,
          external: {
            ...props.external,
            port: value,
          },
        })
      );
    }
  };

  return (
    <div
      className={clsx(classes.root2, {
        [classes.opens]: props.opens,
      })}
    >
      <FormGroup>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          External(tetsimu2 hub)
        </FormLabel>
        <div className={classes.section}>
          <TextFieldEx
            fullWidth
            label="host"
            InputLabelProps={{
              shrink: true,
            }}
            value={props.external.host}
            variant="outlined"
            onChange={handleHostChange}
          />
          <TextFieldEx
            fullWidth
            label="port"
            InputLabelProps={{
              shrink: true,
            }}
            value={props.external.port}
            variant="outlined"
            onChange={handlePortChange}
          />
        </div>
      </FormGroup>
    </div>
  );
});

export default ExternalSettings;
