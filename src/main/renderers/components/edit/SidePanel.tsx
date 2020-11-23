import {
  createStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { blueGrey, grey } from "@material-ui/core/colors";
import CallToActionIcon from "@material-ui/icons/CallToAction";
import EditIcon from "@material-ui/icons/Edit";
import clsx from "clsx";
import React from "react";
import { SidePanelContext } from "../App";
import Tools from "./Tools";

type SidePanelStyleProps = {
  drawerWidth: number;
  maxDrawerWidth: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      userSelect: "none",
    },

    drawerOpen: {
      width: (props) => props.drawerWidth,
      maxWidth: (props: SidePanelStyleProps) => props.maxDrawerWidth,
    },

    drawerClose: {
      overflowX: "hidden",
      width: 48,
      zIndex: 15,
    },

    drawerPaper: {
      border: "none",
      flexDirection: "row",
    },

    resizeHandle: {
      height: "100%",
      width: 8,
      "&:hover": {
        cursor: "w-resize",
      },
    },

    main: {
      flexGrow: 1,
      overflowY: "auto",
    },

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
  tools: <Tools />,
};

const SidePanel: React.FC = () => {
  const [drawerWidth, setDrawerWidth] = React.useContext(
    SidePanelContext
  ).drawerWidth;
  const resizeHandlerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useContext(SidePanelContext).open;

  const [selectedIconName, setSelectedIconName] = React.useState<"tools">(
    "tools"
  );
  const [prevDragX, setPrevDragX] = React.useState<number | null>(null);
  const [main, setMain] = React.useState(<Tools />);

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles({
    drawerWidth,
    maxDrawerWidth: window.innerWidth,
  });

  const handleMenuIconClick = (iconName: "tools") => {
    if (iconName === selectedIconName) {
      if (!open) {
        if (small) {
          setDrawerWidth(window.innerWidth);
        } else {
          setDrawerWidth(Math.max(drawerWidth, 240));
        }
        setMain(mains[iconName]);
      }

      setSelectedIconName(iconName);
      setOpen(!open);
    } else {
      if (small) {
        setDrawerWidth(window.innerWidth);
      } else {
        setDrawerWidth(Math.max(drawerWidth, 240));
      }
      setSelectedIconName(iconName);
      setMain(mains[iconName]);
      setOpen(true);
    }
  };

  const handleResizeHandlePointerDown = (e: React.PointerEvent) => {
    if (resizeHandlerRef.current === null) {
      return;
    }

    resizeHandlerRef.current.setPointerCapture(e.pointerId);
    setPrevDragX(e.pageX);
  };

  const handleResizeHandlePointerMove = (e: React.PointerEvent) => {
    if (prevDragX === null) {
      return;
    }

    const nextDrawWidth = Math.min(
      drawerWidth + (prevDragX - e.pageX),
      window.innerWidth
    );

    setDrawerWidth(nextDrawWidth);
    setOpen(nextDrawWidth > 240);
    setPrevDragX(e.pageX);
  };

  const handleResizeHandlePointerUp = (e: React.PointerEvent) => {
    if (resizeHandlerRef.current === null) {
      return;
    }

    if (prevDragX === null) {
      return;
    }

    resizeHandlerRef.current.releasePointerCapture(e.pointerId);
    setPrevDragX(null);
  };

  const handleResizeHandleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setPrevDragX(touch.pageX);
  };

  const handleResizeHandleTouchMove = (e: React.TouchEvent) => {
    if (e.isDefaultPrevented()) {
      return;
    }

    if (prevDragX === null) {
      return;
    }

    const touch = e.touches[0];
    let nextDrawWidth = Math.min(
      drawerWidth + (prevDragX - touch.pageX),
      window.innerWidth
    );

    setDrawerWidth(nextDrawWidth);
    setOpen(nextDrawWidth > 240);
    setPrevDragX(touch.pageX);
  };

  const handleResizeHandleTouchEnd = () => {
    setPrevDragX(null);
  };

  return (
    <div className={classes.root}>
      <Drawer
        anchor="right"
        variant="permanent"
        className={clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div
          ref={resizeHandlerRef}
          className={classes.resizeHandle}
          onPointerDown={handleResizeHandlePointerDown}
          onPointerMove={handleResizeHandlePointerMove}
          onPointerUp={handleResizeHandlePointerUp}
        ></div>
        <div
          className={classes.main}
          onTouchStart={handleResizeHandleTouchStart}
          onTouchMove={handleResizeHandleTouchMove}
          onTouchEnd={handleResizeHandleTouchEnd}
        >
          {open ? main : <div />}
        </div>
        <div className={classes.iconBar}>
          <List disablePadding>
            <ListItem disableGutters style={{ background: blueGrey[800] }}>
              <ListItemIcon className={classes.listIcon}>
                <EditIcon className={classes.modeIcon} />
              </ListItemIcon>
            </ListItem>
            <ListItem
              button
              disableGutters
              onClick={() => handleMenuIconClick("tools")}
            >
              <ListItemIcon className={classes.listIcon}>
                <CallToActionIcon
                  className={clsx(classes.icon, {
                    selected: selectedIconName === "tools" && open,
                  })}
                />
              </ListItemIcon>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default SidePanel;
