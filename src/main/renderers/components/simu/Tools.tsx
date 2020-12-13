import {
  Button,
  createStyles,
  Divider,
  makeStyles,
  Theme
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import {
  changeTetsimuMode,
  simuToEditMode,
  simuToReplayMode
} from "ducks/root/actions";
import { clearSimu } from "ducks/simu/actions";
import React from "react";
import { TetsimuMode } from "types/core";
import { SimuConductor } from "utils/tetsimu/simu/simuConductor";
import { SimuContext } from "./Simu";

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
      flexDirection: "column",

      "& > div": {
        display: "flex",
        margin: "4px 0",
      },
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
  const { state, dispatch } = React.useContext(SimuContext);

  const handleEditClick = () => {
    dispatch(simuToEditMode(state));
  };

  const handleReplayClick = () => {
    dispatch(simuToReplayMode(state));
  };

  const handleEditNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Edit));
  };

  const handleReplayNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Replay));
  };

  const handleClearClick = () => {
    dispatch(clearSimu(new SimuConductor(state)));
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditClick}
            >
              EDIT
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditNoResetClick}
            >
              <EditIcon />
            </Button>
          </div>
        </div>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReplayClick}
            >
              REPLAY
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReplayNoResetClick}
            >
              <PlayCircleOutlineIcon />
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <Button variant="contained" color="secondary" onClick={handleClearClick}>
        CLEAR
      </Button>
    </div>
  );
};

export default Tools;
