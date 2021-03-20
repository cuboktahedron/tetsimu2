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
import { blueGrey, grey } from "@material-ui/core/colors";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import PageviewIcon from "@material-ui/icons/Pageview";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import SettingsIcon from "@material-ui/icons/Settings";
import clsx from "clsx";
import { forwardStepAuto } from "ducks/replay/actions";
import { getReplayConductor } from "ducks/replay/selectors";
import React from "react";
import { useValueRef } from "renderers/hooks/useValueRef";
import { RootContext, SidePanelContext } from "../App";
import Explorer from "../explorer/Explorer";
import Help from "../Help";
import Settings from "./Settings";
import Stats from "./Stats";
import Tools from "./Tools";

type IconNames =
  | "explorer"
  | "help"
  | "replay/tools"
  | "replay/settings"
  | "replay/stats";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconBar: {
      background: grey[200],
      flexGrow: 0,
      height: "100%",
      marginLeft: "auto",
      width: 48,
    },

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

const mains = {
  explorer: <Explorer />,
  help: <Help />,
  "replay/settings": <Settings />,
  "replay/stats": <Stats />,
  "replay/tools": <Tools />,
};

const SidePanel: React.FC = () => {
  const [drawerWidth, setDrawerWidth] = React.useContext(
    SidePanelContext
  ).drawerWidth;
  const [open, setOpen] = React.useContext(SidePanelContext).open;
  const [selectedMenuName, setSelectedMenuName] = React.useContext(
    SidePanelContext
  ).selectedMenuName;
  const [, setSelectedMenuMain] = React.useContext(
    SidePanelContext
  ).selectedMenuMain;

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles({
    drawerWidth,
    maxDrawerWidth: window.innerWidth,
  });

  React.useLayoutEffect(() => {
    if (!(selectedMenuName in mains)) {
      setSelectedMenuName("replay/tools");
      setSelectedMenuMain(mains["replay/tools"]);
    }
  }, [selectedMenuName]);
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.replay;
  const refState = useValueRef(state);
  const [replayTimerId, setReplayTimerId] = React.useState<number | null>(null);
  const refReplayTimerId = useValueRef(replayTimerId);

  React.useEffect(() => {
    if (state.auto.playing) {
      if (refReplayTimerId.current) {
        window.clearInterval(refReplayTimerId.current);
      }

      const timerId = window.setInterval(() => {
        dispatch(forwardStepAuto(getReplayConductor(refState.current)));
      }, (1 / refState.current.auto.speed) * 500);

      setReplayTimerId(timerId);
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
  }, [state.auto.playing, state.auto.speed]);

  const handleMenuIconClick = (iconName: IconNames) => {
    if (iconName === selectedMenuName) {
      if (!open) {
        if (small) {
          setDrawerWidth(window.innerWidth);
        } else {
          setDrawerWidth(Math.max(drawerWidth, 240));
        }
        setSelectedMenuMain(mains[iconName]);
      }

      setSelectedMenuName(iconName);
      setOpen(!open);
    } else {
      if (small) {
        setDrawerWidth(window.innerWidth);
      } else {
        setDrawerWidth(Math.max(drawerWidth, 240));
      }
      setSelectedMenuName(iconName);
      setSelectedMenuMain(mains[iconName]);
      setOpen(true);
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
              selected: selectedMenuName === "replay/tools" && open,
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
              selected: selectedMenuName === "replay/settings" && open,
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
              selected: selectedMenuName === "replay/stats" && open,
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
              selected: selectedMenuName === "explorer" && open,
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
              selected: selectedMenuName === "help" && open,
            })}
          />
        </ListItemIcon>
      </ListItem>
    </React.Fragment>
  );
};

export default SidePanel;
