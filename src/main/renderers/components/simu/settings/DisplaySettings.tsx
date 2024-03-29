import { Checkbox, FormControlLabel, FormLabel } from "@material-ui/core";
import { changeConfig } from "ducks/simu/actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { Action, MAX_NEXTS_NUM } from "types/core";
import { SimuConfig } from "types/simu";
import NumberTextField from "../../ext/NumberTextField";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 120,
  },
});

type DisplaySettingsProps = {
  config: SimuConfig;
  dispatch: React.Dispatch<Action>;
};

const DisplaySettings = React.memo<DisplaySettingsProps>((props) => {
  const [t] = useTranslation();
  const { config, dispatch } = props;

  const handleNextsNumChange = (value: number): void => {
    if (value !== config.nextNum) {
      dispatch(
        changeConfig({
          ...config,
          nextNum: value,
        })
      );
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

  const handleShowCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      changeConfig({
        ...config,
        showsCycle: e.target.checked,
      })
    );
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          {t("Simu.Settings.Display.Title")}
        </FormLabel>
        <NumberTextField
          label={t("Simu.Settings.Display.Nexts")}
          numberProps={{
            min: 1,
            max: MAX_NEXTS_NUM,
            change: handleNextsNumChange,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          value={"" + config.nextNum}
          variant="outlined"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsPivot}
              onChange={handleShowPivotChange}
            />
          }
          label={t("Simu.Settings.Display.ShowPivot")}
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsGhost}
              onChange={handleShowGhostChange}
            />
          }
          label={t("Simu.Settings.Display.ShowGhost")}
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsCycle}
              onChange={handleShowCycleChange}
            />
          }
          label={t("Simu.Settings.Display.ShowCycle")}
        />
      </div>
    </div>
  );
});

export default DisplaySettings;
