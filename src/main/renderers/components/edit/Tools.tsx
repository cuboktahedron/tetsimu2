import {
  Button,
  createStyles,
  Divider,
  FormControl,
  makeStyles,
  Theme
} from "@material-ui/core";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import {
  buildUpField,
  changeNextBaseNo,
  changeNextsPattern,
  changeNoOfCycle,
  clearEdit,
  flipField,
  slideField
} from "ducks/edit/actions";
import { changeTetsimuMode, editToSimuMode } from "ducks/root/actions";
import React, { useEffect } from "react";
import { useLongTap } from "renderers/hooks/useLongTap";
import { TetsimuMode } from "types/core";
import EditUrl from "utils/tetsimu/edit/editUrl";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import NumberTextField from "../ext/NumberTextField";
import TextFieldEx from "../ext/TextFieldEx";
import { EditContext } from "./Edit";

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
        margin: "4px 0",
      },
    },

    settingGroupTitle: {
      fontWeight: "bold",
      marginTop: "0.5rem",
      marginBottom: "0.5rem",
    },

    longTapButton: {
      touchAction: "none",
    },
  })
);

const MAX_NEXT_BASE_NO = 1000 - 7;

const Tools: React.FC = () => {
  const { state, dispatch } = React.useContext(EditContext);
  const [nextsPattern, setNextsPattern] = React.useState({
    errorText: "",
    value: state.tools.nextsPattern,
  });
  const [stateUrl, setStateUrl] = React.useState("");

  useEffect(() => {
    setNextsPattern({
      errorText: "",
      value: state.tools.nextsPattern,
    });
  }, [state.tools.nextsPattern]);

  const handleUrlClick = () => {
    const url = new EditUrl().fromState(state);
    setStateUrl(url);
  };

  const handleClearClick = () => {
    dispatch(clearEdit());
  };

  const handleFlipClick = () => {
    dispatch(flipField(state.field));
  };

  const handleSlideLeft = React.useCallback(() => {
    dispatch(slideField(state.field, -1));
  }, [state.field]);

  const handleSlideRight = React.useCallback(() => {
    dispatch(slideField(state.field, 1));
  }, [state.field]);

  const handleBuildUp = React.useCallback(() => {
    dispatch(buildUpField(state.field, 1));
  }, [state.field]);

  const handleBuildDown = React.useCallback(() => {
    dispatch(buildUpField(state.field, -1));
  }, [state.field]);

  const handleSimuClick = () => {
    dispatch(editToSimuMode(state));
  };

  const handleEditNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Simu));
  };

  const handleNextsPatternChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.currentTarget.value;
    const interpreter = new NextNotesInterpreter();
    try {
      interpreter.interpret(value);
      setNextsPattern({
        errorText: "",
        value,
      });

      dispatch(changeNextsPattern(value));
    } catch (error) {
      const errorText = error.message ?? "ParseError";
      setNextsPattern({
        errorText,
        value,
      });
    }
  };

  const handleNextBaseNoChange = (value: number): void => {
    if (value !== state.tools.nextBaseNo) {
      dispatch(changeNextBaseNo(value));
    }
  };

  const handleNoOfCycleChange = (value: number): void => {
    if (value !== state.tools.noOfCycle) {
      dispatch(changeNoOfCycle(value));
    }
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
              onClick={handleSimuClick}
            >
              SIMU
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditNoResetClick}
            >
              <SportsEsportsIcon />
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <div>
        <TextFieldEx
          error={!!nextsPattern.errorText}
          fullWidth
          label="Nexts pattern"
          InputLabelProps={{
            shrink: true,
          }}
          value={nextsPattern.value}
          helperText={nextsPattern.errorText}
          variant="outlined"
          onChange={handleNextsPatternChange}
        />
      </div>
      <div>
        <FormControl>
          <NumberTextField
            label="Next"
            numberProps={{
              min: 1,
              max: MAX_NEXT_BASE_NO,
              change: handleNextBaseNoChange,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ minWidth: 100 }}
            value={"" + state.tools.nextBaseNo}
            variant="outlined"
          />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <NumberTextField
            label="No of cycle"
            numberProps={{
              min: 0,
              max: 7,
              change: handleNoOfCycleChange,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ minWidth: 100 }}
            value={"" + state.tools.noOfCycle}
            variant="outlined"
          />
        </FormControl>
      </div>
      <Divider />
      <div>
        <Button
          className={classes.longTapButton}
          variant="contained"
          color="primary"
          {...useLongTap({
            onPress: handleSlideLeft,
            onLongPress: handleSlideLeft,
            interval1: 300,
            interval2: 100,
          })}
        >
          &lt;
        </Button>
        &nbsp;
        <Button
          className={classes.longTapButton}
          variant="contained"
          color="primary"
          {...useLongTap({
            onPress: handleBuildUp,
            onLongPress: handleBuildUp,
            interval1: 300,
            interval2: 100,
          })}
        >
          ∧
        </Button>
        &nbsp;
        <Button
          className={classes.longTapButton}
          variant="contained"
          color="primary"
          {...useLongTap({
            onPress: handleBuildDown,
            onLongPress: handleBuildDown,
            interval1: 300,
            interval2: 100,
          })}
        >
          ∨
        </Button>
        &nbsp;
        <Button
          className={classes.longTapButton}
          variant="contained"
          color="primary"
          {...useLongTap({
            onPress: handleSlideRight,
            onLongPress: handleSlideRight,
            interval1: 300,
            interval2: 100,
          })}
        >
          &gt;
        </Button>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={handleFlipClick}>
          FLIP
        </Button>
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
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearClick}
        >
          CLEAR
        </Button>
      </div>
    </div>
  );
};

export default Tools;
