import {
  createStyles,
  Drawer,
  List,
  makeStyles,
  Theme
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import React from "react";
import { TetsimuMode } from "types/core";
import { RootContext, SidePanelContext } from "../App";
import EditSidePanel from "../edit/SidePanel";
import ReplaySidePanel from "../replay/SidePanel";
import SimuSidePanel from "../simu/SidePanel";

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
      flex: 1,
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

const SidePanel: React.FC = () => {
  const { state } = React.useContext(RootContext);
  const [drawerWidth, setDrawerWidth] = React.useContext(
    SidePanelContext
  ).drawerWidth;
  const resizeHandlerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useContext(SidePanelContext).open;
  const [prevDragX, setPrevDragX] = React.useState<number | null>(null);
  const [selectedMenuMain] = React.useContext(
    SidePanelContext
  ).selectedMenuMain;

  const classes = useStyles({
    drawerWidth,
    maxDrawerWidth: window.innerWidth,
  });

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

  const sidePanel = (() => {
    if (state.mode === TetsimuMode.Simu) {
      return <SimuSidePanel />;
    } else if (state.mode === TetsimuMode.Edit) {
      return <EditSidePanel />;
    } else if (state.mode === TetsimuMode.Replay) {
      return <ReplaySidePanel />;
    } else {
      return <div />;
    }
  })();

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
          {open ? selectedMenuMain : <div />}
        </div>
        <div className={classes.iconBar}>
          <List disablePadding>{sidePanel}</List>
        </div>
      </Drawer>
    </div>
  );
};

export default SidePanel;
