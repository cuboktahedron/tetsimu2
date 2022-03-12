import { Box, Button, Divider, Tab } from "@material-ui/core";
import { TabContext, TabList } from "@material-ui/lab";
import { saveSimuConfig } from "ducks/simu/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { RootContext } from "../../App";
import ExternalSettings from "./ExternalSettings";
import InputSettings from "./InputSettings";
import PlaySettings from "./PlaySettings";

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
  const [selectedTabIndex, setSelectedTabIndex] = React.useState("0");
  const state = rootState.simu;
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const handleTabChange = (_: React.ChangeEvent<{}>, value: string) => {
    setSelectedTabIndex(value);
  };

  const handleSaveClick = () => {
    dispatch(saveSimuConfig(state.config));
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TabContext value={selectedTabIndex}>
        <Box>
          <TabList
            onChange={(e, v: string) => handleTabChange(e, v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Play" value="0" />
            <Tab label="Input" value="1" />
            <Tab label="External" value="2" />
          </TabList>
        </Box>
        <PlaySettings
          stateRef={stateRef}
          dispatch={dispatch}
          opens={selectedTabIndex === "0"}
        />
        <InputSettings
          dispatch={dispatch}
          stateRef={stateRef}
          input={state.config.input}
          opens={selectedTabIndex === "1"}
        />
        <Divider />
        <ExternalSettings
          dispatch={dispatch}
          stateRef={stateRef}
          external={state.config.external}
          opens={selectedTabIndex === "2"}
        />
      </TabContext>

      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveClick}
            >
              SAVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
