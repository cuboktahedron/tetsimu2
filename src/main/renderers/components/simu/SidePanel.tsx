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
import SettingsIcon from "@material-ui/icons/Settings";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import clsx from "clsx";
import {
  changeDrawerState,
  changeSelectedMenuName
} from "ducks/sidePanel/actions";
import React from "react";
import { Action } from "types/core";
import Explorer from "../explorer/Explorer";
import Help from "../Help";
import Settings from "./settings/Settings";
import Stats from "./Stats";
import Tools from "./Tools";

const IconNames = [
  "explorer",
  "help",
  "simu/tools",
  "simu/settings",
  "simu/stats",
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

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles({
    drawerWidth: props.drawerWidth,
    maxDrawerWidth: window.innerWidth,
  });

  React.useLayoutEffect(() => {
    if (!IconNames.includes(props.selectedMenuName as any)) {
      dispatch(changeSelectedMenuName("simu/tools"));
    }

    props.onMenuMainsChanged.current([
      <Explorer key="explorer" opens={props.selectedMenuName === "explorer"} />,
      <Help key="help" opens={props.selectedMenuName === "help"} />,
      <Settings
        key="simu/settings"
        opens={props.selectedMenuName === "simu/settings"}
      />,
      <Stats
        key="simu/stats"
        opens={props.selectedMenuName === "simu/stats"}
      />,
      <Tools
        key="simu/tools"
        opens={props.selectedMenuName === "simu/tools"}
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
          <SportsEsportsIcon className={classes.modeIcon} />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("simu/tools")}
      >
        <ListItemIcon className={classes.listIcon}>
          <CallToActionIcon
            className={clsx(classes.icon, {
              selected: props.selectedMenuName === "simu/tools" && props.open,
            })}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("simu/settings")}
      >
        <ListItemIcon className={classes.listIcon}>
          <SettingsIcon
            className={clsx(classes.icon, {
              selected:
                props.selectedMenuName === "simu/settings" && props.open,
            })}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("simu/stats")}
      >
        <ListItemIcon className={classes.listIcon}>
          <AssessmentOutlinedIcon
            className={clsx(classes.icon, {
              selected: props.selectedMenuName === "simu/stats" && props.open,
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
