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
    HardDrop: new OperationKey({}),
    MoveLeft: new OperationKey({ interval1: 200, interval2: 40 }),
    MoveRight: new OperationKey({ interval1: 200, interval2: 40 }),
    SoftDrop: new OperationKey({ interval1: 40, interval2: 40 }),
    RotateLeft: new OperationKey({}),
    RotateRight: new OperationKey({}),
    Hold: new OperationKey({}),
    Back: new OperationKey({ interval1: 200, interval2: 100 }),
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
            border: activeKeyBorder("HardDrop"),
            right: 44,
            top: 0,
          }}
          onTouchStart={(e) => handleTouchStart(e, "HardDrop")}
          onTouchEnd={(e) => handleTouchEnd(e, "HardDrop")}
        >
          U
        </div>
        <div
          className={`${classes.key} ${classes.keyDir}`}
          style={{
            border: activeKeyBorder("MoveLeft"),
            right: 88,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "MoveLeft")}
          onTouchEnd={(e) => handleTouchEnd(e, "MoveLeft")}
        >
          L
        </div>
        <div
          className={`${classes.key} ${classes.keyDir}`}
          style={{
            border: activeKeyBorder("MoveRight"),
            right: 0,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "MoveRight")}
          onTouchEnd={(e) => handleTouchEnd(e, "MoveRight")}
        >
          R
        </div>
        <div
          className={`${classes.key} ${classes.keyDir}`}
          style={{
            border: activeKeyBorder("SoftDrop"),
            right: 44,
            bottom: 0,
          }}
          onTouchStart={(e) => handleTouchStart(e, "SoftDrop")}
          onTouchEnd={(e) => handleTouchEnd(e, "SoftDrop")}
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
            border: activeKeyBorder("Back"),
            left: 0,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "Back")}
          onTouchEnd={(e) => handleTouchEnd(e, "Back")}
        >
          Y
        </div>
        <div
          className={`${classes.key} ${classes.keyButton}`}
          style={{
            border: activeKeyBorder("Hold"),
            left: 44,
            top: 0,
          }}
          onTouchStart={(e) => handleTouchStart(e, "Hold")}
          onTouchEnd={(e) => handleTouchEnd(e, "Hold")}
        >
          X
        </div>
        <div
          className={`${classes.key} ${classes.keyButton}`}
          style={{
            border: activeKeyBorder("RotateLeft"),
            bottom: 0,
            left: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "RotateLeft")}
          onTouchEnd={(e) => handleTouchEnd(e, "RotateLeft")}
        >
          B
        </div>
        <div
          className={`${classes.key} ${classes.keyButton}`}
          style={{
            border: activeKeyBorder("RotateRight"),
            left: 88,
            top: 44,
          }}
          onTouchStart={(e) => handleTouchStart(e, "RotateRight")}
          onTouchEnd={(e) => handleTouchEnd(e, "RotateRight")}
        >
          A
        </div>
      </div>
    </div>
  );
};

export default VirtualControllerTypeB;
