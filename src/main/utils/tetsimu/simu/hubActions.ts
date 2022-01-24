import React from "react";
import { Action } from "types/core";
import { HubEventEmitter } from "./hubEventEmitter";

type HubContextState = {
  webSocket: WebSocket | null;
  details: string[];
  hubEventEmitter: HubEventEmitter;
  analyzePc: AnalyzePcState,
  tutor: TutorState,
};

type AnalyzePcState = {

}

type TutorState = {

}

export const initialHubState: HubContextState = {
  webSocket: null,
  details: [],
  hubEventEmitter: new HubEventEmitter(),
  analyzePc: {},
  tutor: {},
};

export const HubContext = React.createContext({
  state: initialHubState,
  dispatch: (_: Action) => {},
});

export const hubReducer = (
  state: HubContextState,
  anyAction: Action
): HubContextState => {
  const action = anyAction as HubActions;

  switch (action.type) {
    case HubActionsType.AppendDetails:
      return {
        ...state,
        details: state.details.concat(action.payload.detailsToAppend),
      };
    case HubActionsType.ClearDetails:
      return {
        ...state,
        details: [],
      };
    case HubActionsType.ConnectionClosed:
      return {
        ...state,
        webSocket: null,
        details: state.details.concat(action.payload.detailToAppend),
      };
    case HubActionsType.ConnectionEstablished:
      return {
        ...state,
        webSocket: action.payload.webSocket,
        details: state.details.concat(action.payload.detailToAppend),
      };
  }

  return state;
};

export const HubActionsType = {
  AppendDetails: "hub/appendDetails",
  ClearDetails: "hub/clearDetails",
  ConnectionClosed: "hub/connectionClosed",
  ConnectionEstablished: "hub/connectionEstablished",
} as const;

export type HubActions =
  | AppendDetailsAction
  | ClearDetailsAction
  | ConnectionClosedAction
  | ConnectionEstablishedAction;

export type AppendDetailsAction = {
  type: typeof HubActionsType.AppendDetails;
  payload: {
    detailsToAppend: string[];
  };
} & Action;

export type ClearDetailsAction = {
  type: typeof HubActionsType.ClearDetails;
} & Action;

export type ConnectionClosedAction = {
  type: typeof HubActionsType.ConnectionClosed;
  payload: {
    detailToAppend: string;
  };
} & Action;

export type ConnectionEstablishedAction = {
  type: typeof HubActionsType.ConnectionEstablished;
  payload: {
    webSocket: WebSocket;
    detailToAppend: string;
  };
} & Action;

export const appendDetails = (
  ...detailsToAppend: string[]
): AppendDetailsAction => {
  return {
    type: HubActionsType.AppendDetails,
    payload: {
      detailsToAppend,
    },
  };
};

export const clearDetails = (): ClearDetailsAction => {
  return {
    type: HubActionsType.ClearDetails,
  };
};

export const connectionClosed = (
  detailToAppend: string
): ConnectionClosedAction => {
  return {
    type: HubActionsType.ConnectionClosed,
    payload: {
      detailToAppend,
    },
  };
};

export const connectionEstablished = (
  webSocket: WebSocket,
  detailToAppend: string
): ConnectionEstablishedAction => {
  return {
    type: HubActionsType.ConnectionEstablished,
    payload: {
      webSocket,
      detailToAppend,
    },
  };
};
