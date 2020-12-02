import {
  Checkbox,
  createStyles,

  FormControlLabel,
  FormLabel,
  makeStyles,
  Theme
} from "@material-ui/core";
import { changeConfig } from "ducks/replay/actions";
import React from "react";
import { ReplayContext } from "./Replay";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "white",
      flexGrow: 1,
      padding: 8,

      "& > hr": {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
      },
    },

    formControl: {
      minWidth: 120,
    },

    settingGroupTitle: {
      fontWeight: "bold",
      marginTop: "0.5rem",
      marginBottom: "0.5rem",
    },
  })
);

const Settings: React.FC = () => {
  const { state, dispatch } = React.useContext(ReplayContext);
  const config = state.config;

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
          Display
        </FormLabel>
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.showsPivot}
              onChange={handleShowPivotChange}
            />
          }
          label="Show pivot"
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
          label="Show ghost"
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
          label="Show cycle"
        />
      </div>
    </div>
  );
};

export default Settings;
