import {
  createStyles,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Theme
} from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ReplayIcon from "@material-ui/icons/Replay";
import { redo, retry, superRetry, undo } from "ducks/simu/actions";
import { canRedo, canUndo, getSimuConductor } from "ducks/simu/selectors";
import React from "react";
import { SimuState, SimuStateHistory } from "stores/SimuState";
import { Action } from "types/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "white",
      color: "white",
      height: (props: OperationProps) => 672 * props.zoom,
      width: (props: OperationProps) => 64 * props.zoom,
    },

    listItem: {
      padding: 0,
    },

    iconButton: {
      color: theme.palette.primary.dark,
      padding: 0,

      "&:disabled": {},
    },

    icon: {
      height: (props: OperationProps) => 64 * props.zoom,
      width: (props: OperationProps) => 64 * props.zoom,
    },
  })
);

type OperationProps = {
  dispatch: React.Dispatch<Action>;
  histories: SimuStateHistory[];
  stateRef: React.MutableRefObject<SimuState>;
  step: number;
  zoom: number;
};

const Operation = React.memo<OperationProps>((props) => {
  const stateRef = props.stateRef;
  const { dispatch, histories, step } = props;

  const handleUndo = () => {
    dispatch(undo(step, histories));
  };

  const handleRedo = () => {
    dispatch(redo(step, histories));
  };

  const handleRetry = () => {
    dispatch(retry(getSimuConductor(stateRef.current)));
  };

  const handleSuperRetry = () => {
    dispatch(superRetry(getSimuConductor(stateRef.current)));
  };

  const classes = useStyles(props);

  return (
    <List className={classes.root} disablePadding={true}>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canUndo(stateRef.current)}
          onClick={handleUndo}
        >
          <NavigateBeforeIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canRedo(stateRef.current)}
          onClick={handleRedo}
        >
          <NavigateNextIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton className={classes.iconButton} onClick={handleRetry}>
          <CachedIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton className={classes.iconButton} onClick={handleSuperRetry}>
          <ReplayIcon className={classes.icon} />
        </IconButton>
      </ListItem>
    </List>
  );
});

export default Operation;
