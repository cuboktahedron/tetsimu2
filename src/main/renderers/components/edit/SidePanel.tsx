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
import PageviewIcon from "@material-ui/icons/Pageview";
import clsx from "clsx";
import { changeDrawerState, changeSelectedMenuName } from "ducks/sidePanel/actions";
import React from "react";
import { Action } from "types/core";
import Explorer from "../explorer/Explorer";
import Help from "../Help";
import Tools from "./Tools";

const IconNames = ["edit/tools", "explorer", "explorer", "help"] as const;
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
  onMenuMainsChanged: React.MutableRefObject<(menuMains: JSX.Element[]) => void>;
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
      dispatch(changeSelectedMenuName("edit/tools"));

    }

    props.onMenuMainsChanged.current([
      <Explorer key="explorer" opens={props.selectedMenuName === "explorer"} />,
      <Help key="help" opens={props.selectedMenuName === "help"} />,
      <Tools key="edit/tools" opens={props.selectedMenuName === "edit/tools"} />,
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
              selected: props.selectedMenuName === "edit/tools" && props.open,
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
