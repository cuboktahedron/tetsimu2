import React from "react";

export const useValueRef = <T>(val: T) => {
  const ref = React.useRef(val);
  ref.current = val;

  return ref;
};
