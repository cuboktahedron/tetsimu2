import {
  createStyles,
  Divider,
  ListItem,
  ListItemIcon,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { blueGrey } from "@material-ui/core/colors";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import PageviewIcon from "@material-ui/icons/Pageview";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import clsx from "clsx";
import { forwardAuto, forwardStepAuto } from "ducks/replay/actions";
import { getReplayConductor } from "ducks/replay/selectors";
import {
  changeDrawerState,
  changeSelectedMenuName
} from "ducks/sidePanel/actions";
import React from "react";
import { useValueRef } from "renderers/hooks/useValueRef";
import { Action } from "types/core";
import { RootContext } from "../App";
import Explorer from "../explorer/Explorer";
import Help from "../Help";
import Settings from "./Settings";
import Stats from "./Stats";
import Tools from "./Tools";

const IconNames = [
  "explorer",
  "help",
  "replay/tools",
  "replay/settings",
  "replay/stats",
] as const;

type IconNames = typeof IconNames[number];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listIcon: {
      alignItems: "center",
      minWidth: "unset",
    },

    modeIcon: {
      color: "white",
      fontSize: "48px",
    },

    icon: {
      color: theme.palette.primary.dark,
      fontSize: "48px",

      "&.selected": {
        color: theme.palette.secondary.dark,
      },
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

type SidePanelProps = {
  dispatch: React.Dispatch<Action>;
  drawerWidth: number;
  open: boolean;
  selectedMenuName: string;
  onMenuMainsChanged: React.MutableRefObject<
    (menuMains: JSX.Element[]) => void
  >;
};

const SidePanel = React.memo<SidePanelProps>((props) => {
  const dispatch = props.dispatch;

  const { state: rootState } = React.useContext(RootContext);
  const state = rootState.replay;
  const refState = useValueRef(state);
  const [replayTimerId, setReplayTimerId] = React.useState<number | null>(null);
  const refReplayTimerId = useValueRef(replayTimerId);

  React.useEffect(() => {
    if (refState.current.auto.playing) {
      if (refReplayTimerId.current) {
        window.clearInterval(refReplayTimerId.current);
      }

      if (refState.current.config.showsTrace) {
        const timerId = window.setInterval(() => {
          dispatch(forwardAuto(getReplayConductor(refState.current)));
        }, (1 / refState.current.auto.speed) * 100);

        setReplayTimerId(timerId);
      } else {
        const timerId = window.setInterval(() => {
          dispatch(forwardStepAuto(getReplayConductor(refState.current)));
        }, (1 / refState.current.auto.speed) * 500);

        setReplayTimerId(timerId);
      }
    } else {
      if (refReplayTimerId.current) {
        window.clearInterval(refReplayTimerId.current);
        setReplayTimerId(null);
      }
    }

    return () => {
      if (refReplayTimerId.current) {
        window.clearInterval(refReplayTimerId.current);
        setReplayTimerId(null);
      }
    };
  }, [state.auto.playing, state.auto.speed, state.config.showsTrace]);

  return <InnerSidePanel {...props} />;
});

const InnerSidePanel = React.memo<SidePanelProps>((props) => {
  const dispatch = props.dispatch;

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles({
    drawerWidth: props.drawerWidth,
    maxDrawerWidth: window.innerWidth,
  });

  React.useLayoutEffect(() => {
    if (!IconNames.includes(props.selectedMenuName as any)) {
      dispatch(changeSelectedMenuName("replay/tools"));
    }

    props.onMenuMainsChanged.current([
      <Explorer key="explorer" opens={props.selectedMenuName === "explorer"} />,
      <Help key="help" opens={props.selectedMenuName === "help"} />,
      <Settings
        key="replay/settings"
        opens={props.selectedMenuName === "replay/settings"}
      />,
      <Stats
        key="replay/stats"
        opens={props.selectedMenuName === "replay/stats"}
      />,
      <Tools
        key="replay/tools"
        opens={props.selectedMenuName === "replay/tools"}
      />,
    ]);
  }, [props.selectedMenuName]);

  const handleMenuIconClick = (iconName: IconNames) => {
    if (iconName === props.selectedMenuName) {
      let drawerWidth = props.drawerWidth;
      if (!props.open) {
        if (small) {
          drawerWidth = window.innerWidth;
        } else {
          drawerWidth = Math.max(drawerWidth, 240);
        }
      }

      dispatch(changeDrawerState(drawerWidth, !props.open, iconName));
    } else {
      let drawerWidth = props.drawerWidth;

      if (small) {
        drawerWidth = window.innerWidth;
      } else {
        drawerWidth = Math.max(drawerWidth, 240);
      }

      dispatch(changeDrawerState(drawerWidth, true, iconName));
    }
  };

  return (
    <React.Fragment>
      <ListItem disableGutters style={{ background: blueGrey[800] }}>
        <ListItemIcon className={classes.listIcon}>
          <PlayCircleOutlineIcon className={classes.modeIcon} />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("replay/tools")}
      >
        <ListItemIcon className={classes.listIcon}>
          <CallToActionIcon
            className={clsx(classes.icon, {
              selected: props.selectedMenuName === "replay/tools" && props.open,
            })}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("replay/settings")}
      >
        <ListItemIcon className={classes.listIcon}>
          <SettingsIcon
            className={clsx(classes.icon, {
              selected:
                props.selectedMenuName === "replay/settings" && props.open,
            })}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("replay/stats")}
      >
        <ListItemIcon className={classes.listIcon}>
          <AssessmentOutlinedIcon
            className={clsx(classes.icon, {
              selected: props.selectedMenuName === "replay/stats" && props.open,
            })}
          />
        </ListItemIcon>
      </ListItem>
      <Divider />
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("explorer")}
      >
        <ListItemIcon className={classes.listIcon}>
          <PageviewIcon
            className={clsx(classes.icon, {
              selected: props.selectedMenuName === "explorer" && props.open,
            })}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("help")}
      >
        <ListItemIcon className={classes.listIcon}>
          <HelpOutlineIcon
            className={clsx(classes.icon, {
              selected: props.selectedMenuName === "help" && props.open,
            })}
          />
        </ListItemIcon>
      </ListItem>
    </React.Fragment>
  );
});

export default SidePanel;
