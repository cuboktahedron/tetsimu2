import {
  createStyles,
  List,
  ListItem,
  makeStyles
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
import clsx from "clsx";
import {
  beginCellValueMultiSelection,
  changeToolCellValue,
  endCellValueMultiSelection
} from "ducks/edit/actions";
import React from "react";
import { useLongTap } from "renderers/hooks/useLongTap";
import { FieldCellValue } from "types/core";
import { EditContext } from "./Edit";

const fieldCellColors = {
  [FieldCellValue.None]: "#000",
  [FieldCellValue.Garbage]: grey.A100,
  [FieldCellValue.I]: lightBlue.A100,
  [FieldCellValue.J]: blue.A100,
  [FieldCellValue.L]: orange.A100,
  [FieldCellValue.O]: yellow.A100,
  [FieldCellValue.S]: green.A100,
  [FieldCellValue.T]: purple.A100,
  [FieldCellValue.Z]: red.A100,
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: "white",
      height: (props: StyleProps) => 672 * props.zoom,
      width: (props: StyleProps) => 64 * props.zoom,
    },

    listItem: {
      justifyContent: "center",
      padding: 0,
    },

    cellType: {
      border: "solid 4px black",
      borderRadius: 8,
      boxSizing: "border-box",
      fontSize: "24px",
      fontWeight: "bold",
      height: (props: StyleProps) => 48 * props.zoom,
      margin: "2px auto",
      opacity: 0.7,
      textAlign: "center",
      width: (props: StyleProps) => 48 * props.zoom,

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
      height: (props: StyleProps) => 48 * props.zoom,
      margin: "2px auto",
      width: (props: StyleProps) => 48 * props.zoom,
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

    longTapButton: {
      touchAction: "none",
    },
  })
);

type StyleProps = {
  zoom: number;
};

const Operation: React.FC = () => {
  const { state, dispatch } = React.useContext(EditContext);
  const styleProps = { zoom: state.zoom };

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

  const classes = useStyles(styleProps);

  const cellTypes = [
    { type: FieldCellValue.I, letter: "I" },
    { type: FieldCellValue.J, letter: "J" },
    { type: FieldCellValue.L, letter: "L" },
    { type: FieldCellValue.O, letter: "O" },
    { type: FieldCellValue.S, letter: "S" },
    { type: FieldCellValue.T, letter: "T" },
    { type: FieldCellValue.Z, letter: "Z" },
    { type: FieldCellValue.Garbage, letter: "" },
    { type: FieldCellValue.None, letter: "" },
  ].map((cellType) => {
    return (
      <ListItem
        key={cellType.type}
        className={clsx(
          classes.listItem,
          classes.cellType,
          classes.longTapButton,
          {
            selected: state.tools.selectedCellValues.some(
              (type) => type === cellType.type
            ),
          }
        )}
        disableGutters={true}
        style={{ background: fieldCellColors[cellType.type] }}
        {...useLongTap({
          onPress: (e) => handleToolCellPress(e, cellType.type),
          onLongPress: () => handleToolCellLongPress(),
          interval1: 1000,
        })}
      >
        {cellType.letter}
      </ListItem>
    );
  });

  const handleToolCellLongPress = () => {
    dispatch(beginCellValueMultiSelection());
  };

  const handleEndMultiSelection = () => {
    dispatch(endCellValueMultiSelection());
  };

  return (
    <List className={classes.root} disablePadding={true}>
      {cellTypes}
      <ListItem
        disableGutters={true}
        key={Number.MAX_SAFE_INTEGER}
        className={clsx(classes.listItem, classes.endMultiSelection, {
          [classes.hide]: !state.tools.isCellValueMultiSelection,
        })}
        onClick={handleEndMultiSelection}
      >
        <CloseIcon className={classes.endMultiSelectionIcon} />
      </ListItem>
    </List>
  );
};

export default Operation;
