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
import CallToActionIcon from "@material-ui/icons/CallToAction";
import EditIcon from "@material-ui/icons/Edit";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import clsx from "clsx";
import React from "react";
import { SidePanelContext } from "../App";
import Help from "../Help";
import Tools from "./Tools";

type IconNames = "edit/tools" | "help";

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

const mains = {
  "edit/tools": <Tools />,
  help: <Help />,
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
      setSelectedMenuName("edit/tools");
      setSelectedMenuMain(mains["edit/tools"]);
    }
  }, [selectedMenuName]);

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
          <EditIcon className={classes.modeIcon} />
        </ListItemIcon>
      </ListItem>
      <ListItem
        button
        disableGutters
        onClick={() => handleMenuIconClick("edit/tools")}
      >
        <ListItemIcon className={classes.listIcon}>
          <CallToActionIcon
            className={clsx(classes.icon, {
              selected: selectedMenuName === "edit/tools" && open,
            })}
          />
        </ListItemIcon>
      </ListItem>
      <Divider />
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
