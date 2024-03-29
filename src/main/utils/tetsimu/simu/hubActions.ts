import React from "react";
import { Action, FieldState } from "types/core";
import { AnalyzePcDropType } from "types/simu";
import { HubEventEmitter } from "./hubEventEmitter";

type HubContextState = {
  webSocket: WebSocket | null;
  details: DetailsContent[];
  hubEventEmitter: HubEventEmitter;
  analyzePc: AnalyzePcState;
  tutor: TutorState;
  version: string;
};

type AnalyzePcState = {
  clearLine: number;
  useHold: boolean;
  dropType: AnalyzePcDropType;
};

type TutorState = {};

export const initialHubState: HubContextState = {
  webSocket: null,
  details: [],
  hubEventEmitter: new HubEventEmitter(),
  analyzePc: {
    clearLine: 0,
    useHold: true,
    dropType: AnalyzePcDropType.SoftDrop,
  },
  tutor: {},
  version: "0.9.0",
};

export const HubContext = React.createContext({
  state: initialHubState,
  dispatch: (_: Action) => {},
});

const MAX_DETAILS_HISTORY = 256;

export const hubReducer = (
  state: HubContextState,
  anyAction: Action
): HubContextState => {
  const action = anyAction as HubActions;

  switch (action.type) {
    case HubActionsType.AppendDetails:
      return {
        ...state,
        details: state.details
          .concat(action.payload.detailsToAppend)
          .slice(-MAX_DETAILS_HISTORY),
      };
    case HubActionsType.ChangeAnalyzePcSettings:
      return {
        ...state,
        analyzePc: {
          ...action.payload.analyzePc,
        },
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
        details: state.details
          .concat(action.payload.detailToAppend)
          .slice(-MAX_DETAILS_HISTORY),
      };
    case HubActionsType.ConnectionEstablished:
      return {
        ...state,
        webSocket: action.payload.webSocket,
        details: state.details
          .concat(action.payload.detailToAppend)
          .slice(-MAX_DETAILS_HISTORY),
      };
    case HubActionsType.ChangeVersion:
      return {
        ...state,
        version: action.payload.version,
        details: state.details
          .concat(action.payload.detailToAppend)
          .slice(-MAX_DETAILS_HISTORY),
      };
  }

  return state;
};

export const DetailsContentType = {
  Log: 1,
  AnalyzedPcItem: 2,
} as const;

export type DetailsContentType =
  typeof DetailsContentType[keyof typeof DetailsContentType];

export type DetailsContent =
  | {
      type: typeof DetailsContentType.Log;
      content: string;
    }
  | {
      type: typeof DetailsContentType.AnalyzedPcItem;
      content: {
        settles: string;
        field: FieldState;
      };
    };

export type AnalyzedPcItem = {
  title: string;
  details: AnalyzedPcItemDetail[];
};

export type AnalyzedPcItemDetail = {
  settles: string;
  field: FieldState;
};

export const HubActionsType = {
  AppendAnalyzedItems: "hub/appendAnalyzedItems",
  AppendDetails: "hub/appendDetails",
  ChangeAnalyzePcSettings: "hub/changeAnalyzePcSettings",
  ChangeVersion: "hub/changeVersion",
  ClearDetails: "hub/clearDetails",
  ConnectionClosed: "hub/connectionClosed",
  ConnectionEstablished: "hub/connectionEstablished",
} as const;

export type HubActions =
  | AppendAnalyzedItemsAction
  | AppendDetailsAction
  | ChangeAnalyzePcSettingsAction
  | ChangeVersionAction
  | ClearDetailsAction
  | ConnectionClosedAction
  | ConnectionEstablishedAction;

export type AppendAnalyzedItemsAction = {
  type: typeof HubActionsType.AppendAnalyzedItems;
  payload: {
    detailsToAppend: string[];
  };
} & Action;

export type AppendDetailsAction = {
  type: typeof HubActionsType.AppendDetails;
  payload: {
    detailsToAppend: DetailsContent[];
  };
} & Action;

export type ChangeAnalyzePcSettingsAction = {
  type: typeof HubActionsType.ChangeAnalyzePcSettings;
  payload: {
    analyzePc: AnalyzePcState;
  };
} & Action;

export type ChangeVersionAction = {
  type: typeof HubActionsType.ChangeVersion;
  payload: {
    version: string;
    detailToAppend: DetailsContent;
  };
} & Action;

export type ClearDetailsAction = {
  type: typeof HubActionsType.ClearDetails;
} & Action;

export type ConnectionClosedAction = {
  type: typeof HubActionsType.ConnectionClosed;
  payload: {
    detailToAppend: DetailsContent;
  };
} & Action;

export type ConnectionEstablishedAction = {
  type: typeof HubActionsType.ConnectionEstablished;
  payload: {
    webSocket: WebSocket;
    detailToAppend: DetailsContent;
  };
} & Action;

export const appendAnalyzedItems = (
  uniqueItems: AnalyzedPcItem[],
  minimalItems: AnalyzedPcItem[]
): AppendDetailsAction => {
  const detailsToAppend: DetailsContent[] = [];
  const itemsToDetails = (
    items: AnalyzedPcItem[],
    kind: string
  ): DetailsContent[] => {
    const foundNum = items
      .map((item) => item.details.length)
      .reduce((acc, num) => acc + num, 0);
    detailsToAppend.push({
      type: DetailsContentType.Log,
      content: `# Found ${kind} path [${foundNum}]`,
    });

    return items.flatMap((item) => {
      return item.details.map((detail) => {
        return {
          type: DetailsContentType.AnalyzedPcItem,
          content: detail,
        };
      });
    });
  };

  detailsToAppend.push(...itemsToDetails(uniqueItems, "unique"));
  detailsToAppend.push(...itemsToDetails(minimalItems, "minimal"));
  detailsToAppend.push({
    type: DetailsContentType.Log,
    content: "------------------------",
  });

  return {
    type: HubActionsType.AppendDetails,
    payload: {
      detailsToAppend,
    },
  };
};

export const appendDetails = (
  ...detailsToAppend: string[]
): AppendDetailsAction => {
  const contents = detailsToAppend.map((detail) => {
    return {
      type: DetailsContentType.Log,
      content: detail,
    };
  });

  return {
    type: HubActionsType.AppendDetails,
    payload: {
      detailsToAppend: contents,
    },
  };
};

export const changeAnalyzePcSettings = (
  analyzePc: AnalyzePcState
): ChangeAnalyzePcSettingsAction => {
  return {
    type: HubActionsType.ChangeAnalyzePcSettings,
    payload: {
      analyzePc,
    },
  };
};

export const changeVersion = (
  version: string,
  detail: string
): ChangeVersionAction => {
  return {
    type: HubActionsType.ChangeVersion,
    payload: {
      version,
      detailToAppend: {
        type: DetailsContentType.Log,
        content: detail,
      },
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
      detailToAppend: {
        type: DetailsContentType.Log,
        content: detailToAppend,
      },
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
      detailToAppend: {
        type: DetailsContentType.Log,
        content: detailToAppend,
      },
    },
  };
};
