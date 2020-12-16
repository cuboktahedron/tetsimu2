import { detailedDiff } from "deep-object-diff";
import { Reducer } from "react";

const green = "\u001b[32m";
const blue = "\u001b[34m";
let reducerLogId = 0;
let prevState: any;

export const reducerLogger = <State extends Object, Action>(
  reducer: Reducer<State, Action>
): Reducer<State, Action> => {
  if (process.env.NODE_ENV !== "production") {
    return (state: State, action: Action): State => {
      const newState = reducer(state, action);
      if (newState === prevState) {
        return newState;
      }

      reducerLogId++;

      console.group(("00000000" + reducerLogId).slice(-8));
      console.log(`${blue}Before`, state);
      console.log(`${green}Action`, action);
      if (state === newState) {
        console.log(`${blue}After`, "Same as Before");
      } else {
        console.log(`${blue}After`, newState);
        console.log(`${blue}Diff`, detailedDiff(state, newState));
      }

      console.groupEnd();

      prevState = newState;
      return newState;
    };
  } else {
    return reducer;
  }
};
