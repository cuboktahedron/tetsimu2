import { createStyles, IconButton, makeStyles } from "@material-ui/core";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import React from "react";
import { useControl } from "renderers/hooks/useControl";
import { ControllerKeys, InputKey, Vector2 } from "types/core";
import { OperationKey } from "utils/tetsimu/operationKey";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      border: "solid 8px white",
      borderRadius: 8,
      display: "grid",
      gridTemplateColumns: "56px 56px 56px",
      gridTemplateRows: "56px 56px 56px",
      opacity: 0.3,
      padding: 2,
      position: "absolute",
      userSelect: "none",
      zIndex: 20,
    },

    key: {
      background: "white",
      border: "double 6px black",
      boxSizing: "border-box",
      borderRadius: 8,
      color: "black",
      fontWeight: "bold",
      lineHeight: "44px",
      margin: 1,
      textAlign: "center",
    },

    panHandler: {
      background: "white",
      boxSizing: "border-box",
      borderRadius: "100%",
      margin: 6,
    },
  })
);

const VirtualControllerTypeA: React.FC = () => {
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
    x: (window.innerWidth - 56 * 3) / 2,
    y: (window.innerHeight - 56 * 3) / 2,
  });

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
    const x = touch.pageX - 188 / 2 - 56;
    const y = touch.pageY - 188 / 2 + 56;
    setPosition({ x, y });
  };

  const handlePan = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }

    const touch = e.touches[0];
    const x = touch.pageX - 188 / 2 - 56;
    const y = touch.pageY - 188 / 2 + 56;
    setPosition({ x, y });
  };

  const handlePanEnd = (e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
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
      return "solid 6px red";
    } else {
      return "";
    }
  };

  const virtualKeys = {
    ArrowUp: { label: "U", pos: { x: 2, y: 2 } },
    ArrowLeft: { label: "L", pos: { x: 1, y: 2 } },
    ArrowRight: { label: "R", pos: { x: 3, y: 2 } },
    ArrowDown: { label: "D", pos: { x: 2, y: 3 } },
    z: { label: "RotX", pos: { x: 1, y: 3 } },
    x: { label: "RotR", pos: { x: 3, y: 3 } },
    c: { label: "Hold", pos: { x: 1, y: 1 } },
    b: { label: "Undo", pos: { x: 2, y: 1 } },
  };

  const keyDivs = Object.entries(virtualKeys).map(([key, value]) => {
    const keyName = key as InputKey;
    return (
      <div
        key={keyName}
        className={classes.key}
        style={{
          border: activeKeyBorder(keyName),
          gridColumn: value.pos.x,
          gridRow: value.pos.y,
        }}
        onTouchStart={(e) => handleTouchStart(e, keyName)}
        onTouchEnd={(e) => handleTouchEnd(e, keyName)}
      >
        {value.label}
      </div>
    );
  });

  return (
    <div className={classes.root} style={{ left: position.x, top: position.y }}>
      {keyDivs}
      <div
        key="panHandler"
        className={classes.panHandler}
        style={{ gridColumn: 3, gridRow: 1 }}
        onTouchStart={handlePanStart}
        onTouchMove={handlePan}
        onTouchEnd={handlePanEnd}
      >
        <IconButton style={{ height: "100%", width: "100%" }}>
          <OpenWithIcon style={{ fontSize: 32 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default VirtualControllerTypeA;
