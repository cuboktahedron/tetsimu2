import {
  Button,
  createStyles,

  makeStyles,
  Theme
} from "@material-ui/core";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import { changeTetsimuMode } from "ducks/root/actions";
import React from "react";
import { TetsimuMode } from "types/core";
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

    buttons: {
      display: "flex",
    },

    cellTypes: {
      display: "flex",
      flexWrap: "wrap",

      "& > div": {
        border: "solid 4px black",
        borderRadius: 8,
        boxSizing: "border-box",
        fontSize: "24px",
        fontWeight: "bold",
        height: 48,
        lineHeight: "42px",
        margin: 2,
        opacity: 0.7,
        textAlign: "center",
        width: "48px",

        "&:hover": {
          border: "solid 4px grey",
          cursor: "pointer",
        },

        "&.selected": {
          border: "solid 4px red",
          opacity: 1,
        },
      },
    },

    settingGroupTitle: {
      fontWeight: "bold",
      marginTop: "0.5rem",
      marginBottom: "0.5rem",
    },
  })
);

const Tools: React.FC = () => {
  const { dispatch } = React.useContext(ReplayContext);

  const handleSimuNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Simu));
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <div style={{ marginLeft: "auto" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSimuNoResetClick}
          >
            <SportsEsportsIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tools;
