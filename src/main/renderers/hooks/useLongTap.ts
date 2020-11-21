import React, { useEffect } from "react";
import { MouseButton } from "types/core";

export type LongTapProps = {
  onPress?(): void;
  onLongPress?(): void;
  interval?: number;
};

export const useLongTap = (props: LongTapProps) => {
  const [timerId, setTimerId] = React.useState<number | null>(null);
  const targetRef = React.useRef<Element | null>(null);
  const propsRef = React.useRef<LongTapProps>(props);
  const interval = props.interval || 500;

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  const handleLongPress = () => {
    setTimerId(window.setTimeout(handleLongPress, interval));
    if (propsRef.current && propsRef.current?.onLongPress) {
      propsRef.current.onLongPress();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.preventDefault();

    const target = e.target as Element;
    if (target === null) {
      return;
    }

    targetRef.current = target;
    if (e.button === MouseButton.Left) {
      setTimerId(window.setTimeout(handleLongPress, interval));

      if (props?.onPress) {
        props.onPress();
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.preventDefault();

    if (timerId !== null) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.preventDefault();

    if (timerId !== null) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<Element>): void => {
    e.preventDefault();

    const target = e.target as Element;
    if (target === null) {
      return;
    }

    setTimerId(window.setTimeout(handleLongPress, interval));

    if (props.onPress) {
      props.onPress();
    }
  };

  const handleTouchMove = (e: React.TouchEvent<Element>): void => {
    e.preventDefault();

    const touch = e.touches[0];
    if (targetRef !== null && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const [x, y] = [touch.clientX, touch.clientY];

      if (x < rect.left || rect.right < x || y < rect.top || rect.bottom < y) {
        if (timerId !== null) {
          clearTimeout(timerId);
          setTimerId(null);
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<Element>): void => {
    e.preventDefault();

    if (timerId !== null) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  return {
    onMouseDown: handleMouseDown,
    onMouseLeave: handleMouseLeave,
    onMouseUp: handleMouseUp,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};
