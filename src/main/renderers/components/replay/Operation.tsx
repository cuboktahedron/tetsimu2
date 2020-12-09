import {
  createStyles,
  IconButton,
  List,
  ListItem,
  makeStyles,
  Theme
} from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { backwardStep, forwardStep } from "ducks/replay/actions";
import {
  canBackward,
  canForward,
  getReplayConductor
} from "ducks/replay/selectors";
import React from "react";
import { ReplayContext } from "./Replay";

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
  const { state, dispatch } = React.useContext(ReplayContext);
  const styleProps = { zoom: state.zoom };

  const handleForward = () => {
    dispatch(forwardStep(getReplayConductor(state)));
  };

  const handleBackward = () => {
    dispatch(backwardStep(getReplayConductor(state)));
  };

  const classes = useStyles(styleProps);

  return (
    <List className={classes.root} disablePadding={true}>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canForward(state)}
          onClick={handleForward}
        >
          <NavigateNextIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canBackward(state)}
          onClick={handleBackward}
        >
          <NavigateBeforeIcon className={classes.icon} />
        </IconButton>
      </ListItem>
    </List>
  );
};

export default Operation;
