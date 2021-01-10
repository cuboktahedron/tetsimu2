import {
  Button,
  createStyles,
  Divider,
  FormControl,
  InputAdornment,
  makeStyles,
  Theme,
} from "@material-ui/core";
import FastForwardIcon from "@material-ui/icons/FastForward";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import {
  changeAutoPlaying,
  changeStep,
  downReplaySpeed,
  upReplaySpeed,
} from "ducks/replay/actions";
import { getReplayConductor } from "ducks/replay/selectors";
import { changeTetsimuMode, replayToSimuMode } from "ducks/root/actions";
import React from "react";
import { TetsimuMode } from "types/core";
import ReplayUrl from "utils/tetsimu/replay/replayUrl";
import NumberTextField from "../ext/NumberTextField";
import TextFieldEx from "../ext/TextFieldEx";
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

      "& > div": {
        marginBottom: theme.spacing(1),
      },
    },

    buttons: {
      display: "flex",
      flexDirection: "column",

      "& > div": {
        display: "flex",
        flexWrap: "wrap",

        "& > div": {
          marginRight: theme.spacing(1),
        },
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
  const { state, dispatch } = React.useContext(ReplayContext);
  const [stateUrl, setStateUrl] = React.useState("");

  const handleSimuClick = () => {
    dispatch(replayToSimuMode(state));
  };

  const handleSimuNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Simu));
  };

  const handleStepChange = (value: number): void => {
    if (value !== state.step) {
      dispatch(changeStep(getReplayConductor(state), value));
    }
  };

  const handleFastRewindClick = () => {
    dispatch(downReplaySpeed(state.auto.speed));
  };

  const handlePauseClick = () => {
    dispatch(changeAutoPlaying(false));
  };

  const handlePlayClick = () => {
    dispatch(changeAutoPlaying(true));
  };

  const handleFastForwardClick = () => {
    dispatch(upReplaySpeed(state.auto.speed));
  };

  const handleUrlClick = () => {
    const url = new ReplayUrl().fromState(state);
    setStateUrl(url);
  };

  const classes = useStyles();
  const stepNum = state.replaySteps.length;
  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSimuClick}
            >
              SIMU
            </Button>
          </div>
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
      <Divider />
      <div>
        <FormControl>
          <NumberTextField
            label="Step"
            numberProps={{
              min: 0,
              max: state.replaySteps.length,
              change: handleStepChange,
              endAdornment: (
                <InputAdornment position="end">/ {stepNum}</InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ minWidth: 100 }}
            value={"" + state.step}
            variant="outlined"
          />
        </FormControl>
      </div>
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFastRewindClick}
            >
              <FastRewindIcon />
            </Button>
          </div>
          <div>
            {(() => {
              if (state.auto.playing) {
                return (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePauseClick}
                  >
                    <PauseIcon />
                  </Button>
                );
              } else {
                return (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlayClick}
                  >
                    <PlayArrowIcon />
                  </Button>
                );
              }
            })()}
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFastForwardClick}
            >
              <FastForwardIcon />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={handleUrlClick}>
          URL
        </Button>
      </div>
      <div>
        <TextFieldEx
          fullWidth
          label="url"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly: true,
          }}
          value={stateUrl}
          variant="outlined"
        />
      </div>
    </div>
  );
};

export default Tools;
