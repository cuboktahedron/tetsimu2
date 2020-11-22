import React, { useEffect } from "react";
import { MouseButton } from "types/core";

export type LongTapProps = {
  onPress?(
    event: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>
  ): void;
  onLongPress?(event: EventTarget): void;
  interval1?: number;
  interval2?: number;
};

export const useLongTap = (props: LongTapProps) => {
  const [timerId, setTimerId] = React.useState<number | null>(null);
  const targetRef = React.useRef<Element | null>(null);
  const propsRef = React.useRef<LongTapProps>(props);
  const interval1 = props.interval1 || 500;
  const interval2 = props.interval2 || Number.MAX_SAFE_INTEGER;

  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  const handleLongPress = (e: EventTarget) => {
    setTimerId(window.setTimeout(handleLongPress, interval2));
    if (propsRef.current && propsRef.current?.onLongPress) {
      propsRef.current.onLongPress(e);
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
      setTimerId(window.setTimeout(handleLongPress, interval1));

      if (props?.onPress) {
        props.onPress(e);
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
    const target = e.target as Element;
    if (target === null) {
      return;
    }

    setTimerId(window.setTimeout(handleLongPress, interval1));

    if (props.onPress) {
      props.onPress(e);
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
