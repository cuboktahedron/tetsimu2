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
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import {
  backwardStep,
  changeAutoPlaying,
  changeStep,
  forwardStep
} from "ducks/replay/actions";
import {
  canBackward,
  canForward,
  getReplayConductor
} from "ducks/replay/selectors";
import React from "react";
import { ReplayState } from "stores/ReplayState";
import { Action, ReplayStep } from "types/core";

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
  playing: boolean;
  replaySteps: ReplayStep[];
  stateRef: React.MutableRefObject<ReplayState>;
  step: number;
  zoom: number;
};
const Operation = React.memo<OperationProps>((props) => {
  const stateRef = props.stateRef;
  const { dispatch } = props;

  const handleForward = () => {
    dispatch(forwardStep(getReplayConductor(stateRef.current)));
  };

  const handleBackward = () => {
    dispatch(backwardStep(getReplayConductor(stateRef.current)));
  };

  const handleBackToHeadClick = () => {
    dispatch(changeStep(getReplayConductor(stateRef.current), 0));
  };

  const handlePauseClick = () => {
    dispatch(changeAutoPlaying(false));
  };

  const handlePlayClick = () => {
    dispatch(changeAutoPlaying(true));
  };

  const classes = useStyles(props);

  return (
    <List className={classes.root} disablePadding={true}>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canForward(props.step, props.replaySteps)}
          onClick={handleForward}
        >
          <NavigateNextIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          disabled={!canBackward(props.step)}
          onClick={handleBackward}
        >
          <NavigateBeforeIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        <IconButton
          className={classes.iconButton}
          onClick={handleBackToHeadClick}
        >
          <SkipPreviousIcon className={classes.icon} />
        </IconButton>
      </ListItem>
      <ListItem className={classes.listItem} disableGutters={true}>
        {props.playing ? (
          <IconButton className={classes.iconButton} onClick={handlePauseClick}>
            <PauseIcon className={classes.icon} />
          </IconButton>
        ) : (
          <IconButton className={classes.iconButton} onClick={handlePlayClick}>
            <PlayArrowIcon className={classes.icon} />
          </IconButton>
        )}
      </ListItem>
    </List>
  );
});

export default Operation;
