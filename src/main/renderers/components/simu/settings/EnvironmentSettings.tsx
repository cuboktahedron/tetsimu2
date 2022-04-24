import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import clsx from "clsx";
import { changeConfig } from "ducks/root/actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { Action } from "types/core";
import { EnvironmentConfig } from "types/root";

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

type EnvironmentSettingsProps = {
  dispatch: React.Dispatch<Action>;
  environment: EnvironmentConfig;
  opens: boolean;
};

const EnvironmentSettings = React.memo<EnvironmentSettingsProps>((props) => {
  const dispatch = props.dispatch;
  const classes = useStyles();
  const { t } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    // TODO: Fix "React state update on an unmounted component."
    //   This issue doesn't always occur.
    //   I can reproduce but I don't know the resolution.
    dispatch(
      changeConfig({
        ...props.environment,
        environment: {
          ...props.environment,
          language: e.target.value as string,
        },
      })
    );
  };

  return (
    <div
      className={clsx(classes.root2, {
        [classes.opens]: props.opens,
      })}
    >
      <div className={classes.root}>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel>{t("Simu.Settings.Environment.Language")}</InputLabel>
            <Select
              onChange={handleLanguageChange}
              value={props.environment.language}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
});

export default EnvironmentSettings;
