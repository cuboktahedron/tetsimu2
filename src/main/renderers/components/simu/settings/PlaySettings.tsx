import { Button, Divider } from "@material-ui/core";
import clsx from "clsx";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { initialSimuState, SimuState } from "stores/SimuState";
import { Action } from "types/core";
import DisplaySettings from "./DisplaySettings";
import GarbageSettings from "./GarbageSettings";
import PlayModeSettings from "./PlayModeSetting";

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

type SettingsProps = {
  dispatch: React.Dispatch<Action>;
  stateRef: React.MutableRefObject<SimuState>;
  opens: boolean;
};

const PlaySettings: React.FC<SettingsProps> = (props) => {
  const classes = useStyles();
  const state = props.stateRef.current;
  const dispatch = props.dispatch;
  const { external, input: keys, ...restOfConfig } = initialSimuState.config;
  const { t } = useTranslation();

  const handleDefaultClick = () => {
    dispatch(
      changeConfig({
        ...state.config,
        ...restOfConfig,
      })
    );
  };

  return (
    <div
      className={clsx(classes.root2, {
        [classes.opens]: props.opens,
      })}
    >
      <DisplaySettings config={state.config} dispatch={props.dispatch} />
      <Divider />
      <PlayModeSettings
        config={state.config}
        dispatch={props.dispatch}
        stateRef={props.stateRef}
      />
      <Divider />
      <GarbageSettings config={state.config} dispatch={props.dispatch} />
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDefaultClick}
        >
          {t("Common.Button.Default")}
        </Button>
      </div>
    </div>
  );
};

export default PlaySettings;
