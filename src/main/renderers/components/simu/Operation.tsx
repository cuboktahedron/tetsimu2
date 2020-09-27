import {
  createStyles,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Theme,
} from "@material-ui/core";
import CachedIcon from "@material-ui/icons/Cached";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ReplayIcon from "@material-ui/icons/Replay";
import { redo, retry, superRetry, undo } from "ducks/simu/actions";
import { canRedo, canUndo, getSimuConductor } from "ducks/simu/selectors";
import React from "react";
import { SimuContext } from "./Simu";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: "white",
      color: "white",
      height: (props: StyleProps) => 672 * props.zoom,
      width: (props: StyleProps) => 64 * props.zoom,
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
      height: (props: StyleProps) => 64 * props.zoom,
      width: (props: StyleProps) => 64 * props.zoom,
    },
  })
);

type StyleProps = {
  zoom: number;
};

const Operation: React.FC = () => {
  const { state, dispatch } = React.useContext(SimuContext);
  const styleProps = { zoom: state.zoom };

  const handleUndo = () => {
    dispatch(undo(state.step, state.histories));
  };

  const handleRedo = () => {
    dispatch(redo(state.step, state.histories));
  };

  const handleRetry = () => {
    dispatch(retry(getSimuConductor(state)));
  };

  const handleSuperRetry = () => {
    dispatch(superRetry(getSimuConductor(state)));
  };

  const classes = useStyles(styleProps);

  return (
    <List className={classes.root} disablePadding={true}>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canUndo(state)}
          onClick={handleUndo}
        >
          <NavigateBeforeIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canRedo(state)}
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
};

export default Operation;
