import { FormGroup, FormLabel } from "@material-ui/core";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import TextFieldEx from "renderers/components/ext/TextFieldEx";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { SimuState } from "stores/SimuState";
import { Action } from "types/core";
import { SimuConfig } from "types/simu";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 120,
  },
});

type ExternalSettingsProps = {
  config: SimuConfig;
  dispatch: React.Dispatch<Action>;
  stateRef: React.MutableRefObject<SimuState>;
};

const ExternalSettings = React.memo<ExternalSettingsProps>((props) => {
  const { config, dispatch } = props;
  const classes = useStyles();

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value !== config.external.host) {
      dispatch(
        changeConfig({
          ...config,
          external: {
            ...config.external,
            host: value,
          },
        })
      );
    }
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value !== config.external.port) {
      dispatch(
        changeConfig({
          ...config,
          external: {
            ...config.external,
            port: value,
          },
        })
      );
    }
  };

  return (
    <div>
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
            value={config.external.host}
            variant="outlined"
            onChange={handleHostChange}
          />
          <TextFieldEx
            fullWidth
            label="port"
            InputLabelProps={{
              shrink: true,
            }}
            value={config.external.port}
            variant="outlined"
            onChange={handlePortChange}
          />
        </div>
      </FormGroup>
    </div>
  );
});

export default ExternalSettings;
