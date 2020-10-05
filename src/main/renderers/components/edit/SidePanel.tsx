import {
  createStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
  Theme,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import EditIcon from '@material-ui/icons/Edit';
import clsx from "clsx";
import React from "react";
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

    icon: {
      fontSize: "48px",
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

const SidePanel: React.FC = () => {
  const [drawerWidth, setDrawerWidth] = React.useState(
    Math.min(480, window.innerWidth)
  );
  const [prevDragX, setPrevDragX] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [main, setMain] = React.useState(<Tools />);

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles({
    drawerWidth,
    maxDrawerWidth: window.innerWidth,
  });

  const handleToolsClick = () => {
    if (!open) {
      if (small) {
        setDrawerWidth(window.innerWidth);
      } else {
        setDrawerWidth(Math.min(drawerWidth, window.innerWidth));
      }
    }

    setOpen(!open);
    setMain(<Tools />);
  };

  const handleResizeHandleMouseDown = (e: React.MouseEvent) => {
    setPrevDragX(e.pageX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (prevDragX === null) {
      return;
    }

    const nextDrawWidth = Math.min(
      drawerWidth + (prevDragX - e.pageX),
      window.innerWidth
    );

    if (nextDrawWidth < 200) {
      setDrawerWidth(200);
      setOpen(false);
    } else {
      setDrawerWidth(nextDrawWidth);
      setOpen(true);
    }

    setPrevDragX(e.pageX);
  };

  const handleMouseUp = () => {
    if (prevDragX === null) {
      return;
    }

    setPrevDragX(null);
  };

  const handleResizeHandleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setPrevDragX(touch.pageX);
  };

  const handleResizeHandleTouchMove = (e: React.TouchEvent) => {
    if (prevDragX === null) {
      return;
    }

    const touch = e.touches[0];
    let nextDrawWidth = Math.min(
      drawerWidth + (prevDragX - touch.pageX),
      window.innerWidth
    );

    if (nextDrawWidth < 200) {
      setDrawerWidth(200);
      setOpen(false);
    } else {
      setDrawerWidth(nextDrawWidth);
      setOpen(true);
    }

    setPrevDragX(touch.pageX);
  };

  const handleResizeHandleTouchEnd = () => {
    setPrevDragX(null);
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return (): void => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  React.useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return (): void => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

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
          className={classes.resizeHandle}
          onMouseDown={handleResizeHandleMouseDown}
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
          <List>
            <ListItem button disableGutters onClick={handleToolsClick}>
              <ListItemIcon className={classes.listIcon}>
                <EditIcon className={classes.icon} />
              </ListItemIcon>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default SidePanel;
