import { Box, Button, Tab } from "@material-ui/core";
import { TabContext, TabList } from "@material-ui/lab";
import { saveRootConfig } from "ducks/root/actions";
import { saveSimuConfig } from "ducks/simu/actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { RootContext } from "../../App";
import EnvironmentSettings from "./EnvironmentSettings";
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
  const [saving, setSaving] = React.useState(false);
  const { t } = useTranslation();

  const handleTabChange = (_: React.ChangeEvent<{}>, value: string) => {
    setSelectedTabIndex(value);
  };

  const handleSaveClick = () => {
    dispatch(saveSimuConfig(state.config));
    setSaving(true);
  };

  React.useEffect(() => {
    if (saving) {
      dispatch(saveRootConfig(rootState.config));
      setSaving(false);
    }
  }, [saving]);

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
            <Tab label={t("Simu.Settings.TabPlay")} value="0" />
            <Tab label={t("Simu.Settings.TabInput")} value="1" />
            <Tab label={t("Simu.Settings.TabExternal")} value="2" />
            <Tab label={t("Simu.Settings.TabEnvironment")} value="3" />
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
        <ExternalSettings
          dispatch={dispatch}
          stateRef={stateRef}
          external={state.config.external}
          opens={selectedTabIndex === "2"}
        />
        <EnvironmentSettings
          dispatch={dispatch}
          environment={rootState.config.environment}
          opens={selectedTabIndex === "3"}
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
              {t("Common.Button.Save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
