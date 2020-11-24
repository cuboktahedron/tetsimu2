import {
  Button,
  createStyles,
  Divider,
  FormControl,

  makeStyles,
  Theme
} from "@material-ui/core";
import {
  blue,
  green,
  grey,
  lightBlue,
  orange,
  purple,
  red,
  yellow
} from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import clsx from "clsx";
import {
  beginCellValueMultiSelection,
  buildUpField,
  changeNextBaseNo,
  changeNextsPattern,
  changeNoOfCycle,
  changeToolCellValue,
  clearEdit,
  endCellValueMultiSelection,
  flipField,
  slideField
} from "ducks/edit/actions";
import { changeTetsimuMode, editToSimuMode } from "ducks/root/actions";
import React, { useEffect } from "react";
import { useLongTap } from "renderers/hooks/useLongTap";
import { FieldCellValue, TetsimuMode } from "types/core";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import NumberTextField from "../ext/NumberTextField";
import TextFieldEx from "../ext/TextFieldEx";
import { EditContext } from "./Edit";

const fieldCellColors = {
  [FieldCellValue.NONE]: "#000",
  [FieldCellValue.GARBAGE]: grey.A100,
  [FieldCellValue.I]: lightBlue.A100,
  [FieldCellValue.J]: blue.A100,
  [FieldCellValue.L]: orange.A100,
  [FieldCellValue.O]: yellow.A100,
  [FieldCellValue.S]: green.A100,
  [FieldCellValue.T]: purple.A100,
  [FieldCellValue.Z]: red.A100,
};

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
    },

    cellTypes: {
      display: "flex",
      flexWrap: "wrap",
    },

    cellType: {
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
      width: 48,

      "&:hover": {
        border: "solid 4px grey",
        cursor: "pointer",
      },

      "&.selected": {
        border: "solid 4px red",
        opacity: 1,
      },
    },

    endMultiSelection: {
      height: 48,
      margin: 2,
      textAlign: "center",
      width: 48,
    },

    hide: {
      visibility: "hidden",
    },

    endMultiSelectionIcon: {
      height: "36px",
      opacity: 0.5,
      padding: 6,
      width: "36px",
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

  useEffect(() => {
    setNextsPattern({
      errorText: "",
      value: state.tools.nextsPattern,
    });
  }, [state.tools.nextsPattern]);
  const handleToolCellPress = (
    e: React.MouseEvent | React.TouchEvent,
    cellValue: FieldCellValue
  ) => {
    const selectedCellValues = state.tools.selectedCellValues;
    if (e.ctrlKey || e.metaKey || state.tools.isCellValueMultiSelection) {
      if (selectedCellValues.some((selected) => selected === cellValue)) {
        if (selectedCellValues.length === 1) {
          return;
        }

        const newSelectedCellValues = selectedCellValues.filter(
          (selected) => selected !== cellValue
        );
        dispatch(changeToolCellValue(newSelectedCellValues));
      } else {
        const newSelectedCellValues = [...selectedCellValues, cellValue];
        dispatch(changeToolCellValue(newSelectedCellValues));
      }
    } else {
      if (selectedCellValues.length > 1) {
        dispatch(changeToolCellValue([cellValue]));
      } else {
        const selectedCellValue = selectedCellValues[0];
        if (selectedCellValue !== cellValue) {
          dispatch(changeToolCellValue([cellValue]));
        }
      }
    }
  };

  const handleToolCellLongPress = () => {
    dispatch(beginCellValueMultiSelection());
  };

  const handleEndMultiSelection = () => {
    dispatch(endCellValueMultiSelection());
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

  const cellTypes = [
    { type: FieldCellValue.I, letter: "I" },
    { type: FieldCellValue.J, letter: "J" },
    { type: FieldCellValue.L, letter: "L" },
    { type: FieldCellValue.O, letter: "O" },
    { type: FieldCellValue.S, letter: "S" },
    { type: FieldCellValue.T, letter: "T" },
    { type: FieldCellValue.Z, letter: "Z" },
    { type: FieldCellValue.GARBAGE, letter: "" },
    { type: FieldCellValue.NONE, letter: "" },
  ].map((cellType) => {
    return (
      <div
        key={cellType.type}
        className={clsx(classes.cellType, classes.longTapButton, {
          selected: state.tools.selectedCellValues.some(
            (type) => type === cellType.type
          ),
        })}
        style={{ background: fieldCellColors[cellType.type] }}
        {...useLongTap({
          onPress: (e) => handleToolCellPress(e, cellType.type),
          onLongPress: () => handleToolCellLongPress(),
          interval1: 1000,
        })}
      >
        {cellType.letter}
      </div>
    );
  });

  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
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
      <Divider />
      <div className={classes.cellTypes}>
        {cellTypes}
        <div
          key={Number.MAX_SAFE_INTEGER}
          className={clsx(classes.endMultiSelection, {
            [classes.hide]: !state.tools.isCellValueMultiSelection,
          })}
          onClick={handleEndMultiSelection}
        >
          <CloseIcon className={classes.endMultiSelectionIcon} />
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
            label="No of Cycle"
            numberProps={{
              min: 1,
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
      <br />
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
