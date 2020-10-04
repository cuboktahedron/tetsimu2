import { createStyles, IconButton, makeStyles } from "@material-ui/core";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import React, { useEffect } from "react";
import { useControl } from "renderers/hooks/useControl";
import { ControllerKeys, InputKey, Vector2 } from "types/core";
import { OperationKey } from "utils/tetsimu/operationKey";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      alignItems: "center",
      display: "flex",
      opacity: 0.3,
      position: "absolute",
      left: 0,
      userSelect: "none",
      width: "100%",
      zIndex: 20,
    },

    keyGroup: {
      flexGrow: 0,
      height: 144,
      position: "relative",
      width: 144,
    },

    stretchKeyGroup: {
      flexGrow: 1,
    },

    key: {
      background: "white",
      boxSizing: "border-box",
      color: "black",
      fontWeight: "bold",
      position: "absolute",
      textAlign: "center",
    },

    keyDir: {
      border: "double 6px black",
      borderRadius: "100%",
      height: 56,
      lineHeight: "44px",
      width: 56,
    },

    keyButton: {
      border: "double 6px black",
      borderRadius: "100%",
      height: 56,
      lineHeight: "44px",
      width: 56,
    },

    panHandler: {
      background: "white",
      border: "double 6px black",
      boxSizing: "border-box",
      borderRadius: "100%",
      height: 48,
      margin: "0 auto",
      width: 48,
    },
  })
);

const VirtualControllerTypeB: React.FC = () => {
  const initialKeys: ControllerKeys = {
    ArrowUp: new OperationKey({}),
    ArrowLeft: new OperationKey({ interval1: 200, interval2: 40 }),
    ArrowRight: new OperationKey({ interval1: 200, interval2: 40 }),
    ArrowDown: new OperationKey({ interval1: 40, interval2: 40 }),
    z: new OperationKey({}),
    x: new OperationKey({}),
    c: new OperationKey({}),
    b: new OperationKey({}),
  };

  const [keys, setKeys] = React.useState(initialKeys);
  const [position, setPosition] = React.useState<Vector2>({
    x: 0,
    y: 0,
  });
  const [startTouchPosition, setStartTouchPosition] = React.useState<Vector2>({
    x: 0,
    y: 0,
  });
  const [deltaTouchPosition, setDeltaTouchPosition] = React.useState<Vector2>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const y = window.innerHeight - 164;
    setPosition({ x: 8, y });
  }, []);

  const classes = useStyles();

  const handleTouchStart = (e: React.TouchEvent, keyName: InputKey) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keys[keyName].down();
  };

  const handleTouchEnd = (e: React.TouchEvent, keyName: InputKey) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keys[keyName].up();
  };

  const handlePanStart = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    const x = touch.pageX;
    const y = touch.pageY;
    setStartTouchPosition({ x, y });
  };

  const handlePan = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    const deltaX = touch.pageX - startTouchPosition.x;
    const deltaY = touch.pageY - startTouchPosition.y;
    setDeltaTouchPosition({ x: deltaX, y: deltaY });
  };

  const handlePanEnd = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    const x = position.x + deltaTouchPosition.x;
    const y = position.y + deltaTouchPosition.y;
    setPosition({ x, y });
    setStartTouchPosition({ x: 0, y: 0 });
    setDeltaTouchPosition({ x: 0, y: 0 });
  };

  useControl(keys);

  React.useEffect(() => {
    const timerId = setInterval(() => {
      for (const key of Object.values(keys)) {
        key.refresh();
      }

      setKeys({ ...keys });
    }, 20);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const activeKeyBorder = (keyName: InputKey) => {
    const key = keys[keyName];
    if (key.pressed) {
      return "solid 4px red";
    } else {
      return "";
    }
  };

  return (
    <div
      className={classes.root}
      style={{ top: position.y + deltaTouchPosition.y }}
    >
      <div
        className={classes.keyGroup}
        style={{ marginLeft: position.x + deltaTouchPosition.x }}
      >
        <div
          className={`${classes.key} ${classes.keyDir}`}
          style={{
            border: activeKeyBorder("ArrowUp"),
            right: 44,
            top: 0,
          }}
          onTouchStart={(e) => handleTouchStart(e, "ArrowUp")}
          onTouchEnd={(e) => handleTouchEnd(e, "ArrowUp")}
        >
          U
        </div>
        <div
          className={`${classes.key} ${classes.keyDir}`}
          style={{
            border: activeKeyBorder("ArrowLeft"),
            right: 88,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "ArrowLeft")}
          onTouchEnd={(e) => handleTouchEnd(e, "ArrowLeft")}
        >
          L
        </div>
        <div
          className={`${classes.key} ${classes.keyDir}`}
          style={{
            border: activeKeyBorder("ArrowRight"),
            right: 0,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "ArrowRight")}
          onTouchEnd={(e) => handleTouchEnd(e, "ArrowRight")}
        >
          R
        </div>
        <div
          className={`${classes.key} ${classes.keyDir}`}
          style={{
            border: activeKeyBorder("ArrowDown"),
            right: 44,
            bottom: 0,
          }}
          onTouchStart={(e) => handleTouchStart(e, "ArrowDown")}
          onTouchEnd={(e) => handleTouchEnd(e, "ArrowDown")}
        >
          D
        </div>
      </div>
      <div className={classes.stretchKeyGroup}>
        <div
          className={classes.panHandler}
          onTouchStart={handlePanStart}
          onTouchMove={handlePan}
          onTouchEnd={handlePanEnd}
        >
          <IconButton style={{ height: "100%", width: "100%" }}>
            <OpenWithIcon style={{ fontSize: 32 }} />
          </IconButton>
        </div>
      </div>
      <div
        className={classes.keyGroup}
        style={{ marginRight: position.x + deltaTouchPosition.x }}
      >
        <div
          className={`${classes.key} ${classes.keyButton}`}
          style={{
            border: activeKeyBorder("b"),
            left: 0,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "b")}
          onTouchEnd={(e) => handleTouchEnd(e, "b")}
        >
          Y
        </div>
        <div
          className={`${classes.key} ${classes.keyButton}`}
          style={{
            border: activeKeyBorder("c"),
            left: 44,
            top: 0,
          }}
          onTouchStart={(e) => handleTouchStart(e, "c")}
          onTouchEnd={(e) => handleTouchEnd(e, "c")}
        >
          X
        </div>
        <div
          className={`${classes.key} ${classes.keyButton}`}
          style={{
            border: activeKeyBorder("z"),
            bottom: 0,
            left: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "z")}
          onTouchEnd={(e) => handleTouchEnd(e, "z")}
        >
          A
        </div>
        <div
          className={`${classes.key} ${classes.keyButton}`}
          style={{
            border: activeKeyBorder("x"),
            left: 88,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "x")}
          onTouchEnd={(e) => handleTouchEnd(e, "x")}
        >
          B
        </div>
      </div>
    </div>
  );
};

export default VirtualControllerTypeB;
