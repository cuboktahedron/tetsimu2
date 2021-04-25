import {
  createStyles,
  Drawer,
  List,
  makeStyles,
  Theme
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import { changeDrawerState } from "ducks/sidePanel/actions";
import React from "react";
import { useValueRef } from "renderers/hooks/useValueRef";
import { TetsimuMode } from "types/core";
import { RootContext } from "../App";
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
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.sidePanel;
  const [menuMains, setMenuMains] = React.useState<JSX.Element[]>([]);

  const resizeHandlerRef = React.useRef<HTMLDivElement>(null);
  const [prevDragX, setPrevDragX] = React.useState<number | null>(null);

  const classes = useStyles({
    drawerWidth: state.drawerWidth,
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
      state.drawerWidth + (prevDragX - e.pageX),
      window.innerWidth
    );

    dispatch(
      changeDrawerState(
        nextDrawWidth,
        nextDrawWidth > 240,
        state.selectedMenuNames
      )
    );
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
      state.drawerWidth + (prevDragX - touch.pageX),
      window.innerWidth
    );

    dispatch(
      changeDrawerState(
        nextDrawWidth,
        nextDrawWidth > 240,
        state.selectedMenuNames
      )
    );
    setPrevDragX(touch.pageX);
  };

  const handleResizeHandleTouchEnd = () => {
    setPrevDragX(null);
  };

  const menuMainsChangedHandler = useValueRef((menuMains: JSX.Element[]) =>
    setMenuMains(menuMains)
  );

  const panelProps = {
    dispatch: dispatch,
    drawerWidth: state.drawerWidth,
    open: state.opens,
    selectedMenuName: state.selectedMenuNames,
    onMenuMainsChanged: menuMainsChangedHandler,
  };

  const sidePanel = (() => {
    if (rootState.mode === TetsimuMode.Simu) {
      return <SimuSidePanel {...panelProps} />;
    } else if (rootState.mode === TetsimuMode.Edit) {
      return <EditSidePanel {...panelProps} />;
    } else if (rootState.mode === TetsimuMode.Replay) {
      return <ReplaySidePanel {...panelProps} />;
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
          [classes.drawerOpen]: state.opens,
          [classes.drawerClose]: !state.opens,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: state.opens,
            [classes.drawerClose]: !state.opens,
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
          {menuMains}
        </div>
        <div className={classes.iconBar}>
          <List disablePadding>{sidePanel}</List>
        </div>
      </Drawer>
    </div>
  );
};

export default SidePanel;
