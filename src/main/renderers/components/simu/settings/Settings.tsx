import { Button, Divider } from "@material-ui/core";
import { resetSimuConfigToDefault, saveSimuConfig } from "ducks/simu/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { RootContext } from "../../App";
import DisplaySettings from "./DisplaySettings";
import ExternalSettings from "./ExternalSettings";
import GarbageSettings from "./GarbageSettings";
import InputSettings from "./InputSettings";
import PlayModeSettings from "./PlayModeSetting";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 120,
  },
});

type SettingsProps = {
  opens: boolean;
};

const Settings: React.FC<SettingsProps> = (props) => {
  if (!props.opens) {
    return null;
  }

  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.simu;
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const handleDefaultClick = () => {
    dispatch(resetSimuConfigToDefault());
  };

  const handleSaveClick = () => {
    dispatch(saveSimuConfig(state.config));
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <DisplaySettings config={state.config} dispatch={dispatch} />
      <Divider />
      <PlayModeSettings
        config={state.config}
        dispatch={dispatch}
        stateRef={stateRef}
      />
      <Divider />
      <GarbageSettings config={state.config} dispatch={dispatch} />
      <Divider />
      <InputSettings
        config={state.config}
        dispatch={dispatch}
        isTouchDevice={state.env.isTouchDevice}
      />
      <Divider />
      <ExternalSettings
        config={state.config}
        dispatch={dispatch}
        stateRef={stateRef}
      />
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
