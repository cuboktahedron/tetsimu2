import {
  Button,
  createStyles,
  Divider,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import {
  blue,
  green,
  grey,
  lightBlue,
  orange,
  purple,
  red,
  yellow,
} from "@material-ui/core/colors";
import clsx from "clsx";
import {
  changeNextsPattern,
  changeToolCellValue,
  clearEdit,
} from "ducks/edit/actions";
import React, { useEffect } from "react";
import { FieldCellValue } from "types/core";
import NextNotesParser from "utils/tetsimu/nextNoteParser";
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
  const { state, dispatch } = React.useContext(EditContext);
  const [nextsPattern, setNextsPattern] = React.useState({
    errorText: "",
    value: state.tools.nextsPattern,
  });

  const [textKeys, setTextKeys] = React.useState({
    nextsPattern: new Date().getTime(),
  });

  useEffect(() => {
    setNextsPattern({
      errorText: "",
      value: state.tools.nextsPattern,
    });
  }, [state.tools.nextsPattern]);
  const handleToolCellClick = (cellValue: FieldCellValue) => {
    if (state.tools.selectedCellType !== cellValue) {
      dispatch(changeToolCellValue(cellValue));
    }
  };

  const handleClearClick = () => {
    dispatch(clearEdit());
  };

  const handleNextsPatternChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.currentTarget.value;
    const parser = new NextNotesParser();
    try {
      parser.parse(value);
      setNextsPattern({
        errorText: "",
        value,
      });

      dispatch(changeNextsPattern(value));
    } catch (error) {
      setNextsPattern({
        errorText: "Incorrect pattern",
        value,
      });
    }
  };

  const handleNextsPatternKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key !== "Enter") {
      return;
    }

    if (!!nextsPattern.errorText) {
      return;
    }

    if (nextsPattern.value !== state.tools.nextsPattern) {
      dispatch(changeNextsPattern(nextsPattern.value));
    }
  };

  const handleNextsPatternBlur = (): void => {
    if (nextsPattern.value !== state.tools.nextsPattern) {
      dispatch(changeNextsPattern(nextsPattern.value));

      setTextKeys({ ...textKeys, nextsPattern: new Date().getTime() });
    }
  };

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
        className={clsx({
          selected: state.tools.selectedCellType === cellType.type,
        })}
        style={{ background: fieldCellColors[cellType.type] }}
        onClick={() => handleToolCellClick(cellType.type)}
      >
        {cellType.letter}
      </div>
    );
  });

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.cellTypes}>{cellTypes}</div>
      <Divider />
      <TextField
        key={textKeys.nextsPattern}
        error={!!nextsPattern.errorText}
        fullWidth
        label="Nexts pattern"
        InputLabelProps={{
          shrink: true,
        }}
        value={nextsPattern.value}
        helperText={nextsPattern.errorText}
        variant="outlined"
        onBlur={handleNextsPatternBlur}
        onChange={handleNextsPatternChange}
        onKeyDown={handleNextsPatternKeyDown}
      />
      <Divider />
      <Button variant="contained" color="secondary" onClick={handleClearClick}>
        CLEAR
      </Button>
    </div>
  );
};

export default Tools;