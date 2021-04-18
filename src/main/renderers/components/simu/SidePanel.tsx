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
import React from "react";
import { SidePanelContext } from "../App";
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

const SidePanel: React.FC = () => {
  const [drawerWidth, setDrawerWidth] = React.useContext(
    SidePanelContext
  ).drawerWidth;
  const [open, setOpen] = React.useContext(SidePanelContext).open;
  const [, setMenuMains] = React.useContext(SidePanelContext).menuMains;
  const [selectedMenuName, setSelectedMenuName] = React.useContext(
    SidePanelContext
  ).selectedMenuName;

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles({
    drawerWidth,
    maxDrawerWidth: window.innerWidth,
  });

  React.useLayoutEffect(() => {
    if (!IconNames.includes(selectedMenuName as any)) {
      setSelectedMenuName("simu/tools");
    }

    setMenuMains([
      <Explorer key="explorer" opens={selectedMenuName === "explorer"} />,
      <Help key="help" opens={selectedMenuName === "help"} />,
      <Settings
        key="simu/settings"
        opens={selectedMenuName === "simu/settings"}
      />,
      <Stats key="simu/stats" opens={selectedMenuName === "simu/stats"} />,
      <Tools key="simu/tools" opens={selectedMenuName === "simu/tools"} />,
    ]);
  }, [selectedMenuName]);

  const handleMenuIconClick = (iconName: IconNames) => {
    if (iconName === selectedMenuName) {
      if (!open) {
        if (small) {
          setDrawerWidth(window.innerWidth);
        } else {
          setDrawerWidth(Math.max(drawerWidth, 240));
        }
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
      setOpen(true);
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
              selected: selectedMenuName === "simu/tools" && open,
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
              selected: selectedMenuName === "simu/settings" && open,
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
              selected: selectedMenuName === "simu/stats" && open,
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
