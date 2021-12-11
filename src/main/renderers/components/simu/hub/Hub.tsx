import { Button, Divider } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { RootContext } from "renderers/components/App";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import {
  AnalyzePcMessageRes,
  InitTutorMessageRes,
  LogMessage,
  StepsMessage,
  TermTutorMessageRes,
  UnhandledMessage,
} from "types/simuMessages";
import {
  appendDetails,
  clearDetails,
  connectionClosed,
  connectionEstablished as connectionEstablished,
  HubContext,
  hubReducer,
  initialHubState,
} from "utils/tetsimu/simu/hubActions";
import { HubMessageEventTypes } from "utils/tetsimu/simu/hubEventEmitter";
import AnalyzePc from "./AnalyzePc";
import Tutor from "./Tutor";

const useStyles = useSidePanelStyles({
  closes: {
    display: "none",
  },

  root2: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 32px)",
  },

  details: {
    border: "solid 1px grey",
    boxSizing: "border-box",
    flex: "1 0 auto",
    minHeight: 300,
    maxHeight: 600,
    overflowY: "scroll",
    padding: 4,
    userSelect: "text",
  },
});

type HubProps = {
  opens: boolean;
};

const Hub: React.FC<HubProps> = (props) => {
  const { state: rootState } = React.useContext(RootContext);
  const rootStateRef = useValueRef(rootState);
  const [state, hubDispatch] = React.useReducer(hubReducer, initialHubState);
  const stateRef = useValueRef(state);
  const detailsElemRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    stateRef.current.hubEventEmitter.addListener(
      HubMessageEventTypes.Log,
      handleLogMessage
    );
    stateRef.current.hubEventEmitter.addListener(
      HubMessageEventTypes.Unhandled,
      handleUnhandledMessage
    );
  }, [stateRef.current.hubEventEmitter]);

  React.useEffect(() => {
    const elem = detailsElemRef.current;
    if (elem === null) {
      return;
    }

    elem.scrollTop = elem.scrollHeight;
  }, [state.details]);

  React.useEffect(() => {
    return () => {
      if (stateRef.current.webSocket) {
        stateRef.current.webSocket.close();
      }
    };
  }, []);

  const handleConnectHubClick = () => {
    if (state.webSocket !== null) {
      state.webSocket.close();
    }

    const external = rootState.simu.config.external;
    const url = `ws://${external.host}:${external.port}`;

    let ws = new WebSocket(url);
    hubDispatch(appendDetails(`Connect to ${url} ...`));

    ws.onopen = () => {
      hubDispatch(connectionEstablished(ws, "Connection established."));
    };

    ws.onclose = (e: CloseEvent) => {
      hubDispatch(
        connectionClosed(`Connection closed.(${e.code}:${e.reason})`)
      );
    };

    ws.onerror = () => {
      hubDispatch(appendDetails(`Error occured.`));
    };

    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      // Response messages
      if (message.InitTutor) {
        const initTutor = message.Log as InitTutorMessageRes;
        state.hubEventEmitter.emit(HubMessageEventTypes.InitTuror, initTutor);
      } else if (message.TermTutor) {
        const logMessage = message.Log as TermTutorMessageRes;
        state.hubEventEmitter.emit(HubMessageEventTypes.TermTuror, logMessage);
      }

      // Hub messages
      else if (message.Log) {
        const realMessage = message.Log as LogMessage;
        state.hubEventEmitter.emit(HubMessageEventTypes.Log, realMessage);
      } else if (message.AnalyzePc) {
        const analyzePc = message.AnalyzePc as AnalyzePcMessageRes;
        state.hubEventEmitter.emit(HubMessageEventTypes.AnalyzePc, analyzePc);
      } else if (message.Steps) {
        const realMessage = message.Steps as StepsMessage;
        state.hubEventEmitter.emit(HubMessageEventTypes.Steps, realMessage);
      } else if (message.Unhandled) {
        const unhandled = message.Unhandled as UnhandledMessage;
        state.hubEventEmitter.emit(HubMessageEventTypes.Unhandled, unhandled);
      }
    };
  };

  const handleLogMessage = (message: AnalyzePcMessageRes) => {
    hubDispatch(appendDetails(message.body.message));
  };

  const handleUnhandledMessage = (message: UnhandledMessage) => {
    hubDispatch(appendDetails(message.body.message));
  };

  const handleClearClick = () => {
    hubDispatch(clearDetails());
  };

  const isReadyToConnect = () => {
    return (
      state.webSocket !== null ||
      !rootState.simu.config.external.host ||
      !rootState.simu.config.external.port
    );
  };

  const details = React.useMemo(() => {
    return state.details.flatMap((detail, i) => {
      return detail.split("\n").map((line, j) => {
        return <div key={`${i}-${j}`}>{line}</div>;
      });
    });
  }, [state.details]);

  const classes = useStyles();

  return (
    <HubContext.Provider value={{ state, dispatch: hubDispatch }}>
      <div
        className={clsx(classes.root, {
          [classes.closes]: !props.opens,
          [classes.root2]: props.opens,
        })}
      >
        <div className={classes.buttons}>
          <div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConnectHubClick}
                disabled={isReadyToConnect()}
              >
                Connect Hub
              </Button>
            </div>
          </div>
        </div>
        <Divider />
        <AnalyzePc rootStateRef={rootStateRef} />
        <Tutor />

        <div className={classes.buttons}>
          <div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearClick}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        <div ref={detailsElemRef} className={classes.details}>
          {details}
        </div>
      </div>
    </HubContext.Provider>
  );
};

export default Hub;
