import { Box, Button, Divider, Tab } from "@material-ui/core";
import { TabContext, TabList } from "@material-ui/lab";
import clsx from "clsx";
import { setPopupField } from "ducks/simu/actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { RootContext } from "renderers/components/App";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { FieldState } from "types/core";
import {
  AnalyzePcMessageRes,
  InitTutorMessageRes,
  LogMessage,
  StepsMessage,
  TermTutorMessageRes,
  UnhandledMessage
} from "types/simuMessages";
import {
  appendDetails,
  clearDetails,
  connectionClosed,
  connectionEstablished,
  DetailsContentType,
  HubContext,
  hubReducer,
  initialHubState
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

  tabPanel: {
    border: "solid 1px grey",
    display: "none",
  },

  details: {
    border: "solid 1px grey",
    boxSizing: "border-box",
    flex: "1 0 auto",
    minHeight: 200,
    height: 0,
    overflowY: "scroll",
    padding: 4,
    userSelect: "text",
  },

  linkWrapper: {
    "&::before": {
      content: '"-"',
      display: "inline-block",
      margin: "0 4px",
    },
  },

  link: {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline",
  },

  selectedLink: {
    color: "red",
  },
});

type HubProps = {
  opens: boolean;
};

const Hub: React.FC<HubProps> = (props) => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const rootStateRef = useValueRef(rootState);
  const [state, hubDispatch] = React.useReducer(hubReducer, initialHubState);
  const stateRef = useValueRef(state);
  const detailsElemRef = React.useRef<HTMLDivElement>(null);
  const [selectedTabIndex, setSelectedTabIndex] = React.useState("0");
  const { t } = useTranslation();

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
    hubDispatch(
      appendDetails(
        `${t("Simu.Hub.Message.ConnectTo")}`.replace("{{url}}", url)
      )
    );

    ws.onopen = () => {
      hubDispatch(
        connectionEstablished(ws, t("Simu.Hub.Message.ConnectionEstablished"))
      );
    };

    ws.onclose = (e: CloseEvent) => {
      hubDispatch(
        connectionClosed(
          `${t("Simu.Hub.Message.ConnectionClosed")}`
            .replace("{{code}}", "" + e.code)
            .replace("{{reason}}", e.reason)
        )
      );
    };

    ws.onerror = () => {
      hubDispatch(appendDetails(t("Simu.Hub.Message.ErrorOccured")));
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

  const handleTabChange = (_: React.ChangeEvent<{}>, value: string) => {
    setSelectedTabIndex(value);
  };

  const handleSettlesClick = (field: FieldState) => {
    if (field === rootStateRef.current.simu.popupField) {
      dispatch(setPopupField(null));
    } else {
      dispatch(setPopupField(field));
    }
  };

  const classes = useStyles();

  const details = React.useMemo(() => {
    return state.details.flatMap((detail, i) => {
      if (detail.type === DetailsContentType.Log) {
        return detail.content.split("\n").map((line, j) => {
          return <div key={`${i}-${j}`}>{line}</div>;
        });
      } else if (detail.type === DetailsContentType.AnalyzedPcItem) {
        return (
          <div className={classes.linkWrapper} key={`${i}`}>
            <span
              className={clsx(classes.link, {
                [classes.selectedLink]:
                  rootStateRef.current.simu.popupField === detail.content.field,
              })}
              onClick={() => handleSettlesClick(detail.content.field)}
            >
              {detail.content.settles}
            </span>
          </div>
        );
      } else {
        return <div />;
      }
    });
  }, [state.details, rootStateRef.current.simu.popupField]);

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
                {t("Simu.Hub.Button.ConnectToHub")}
              </Button>
            </div>
          </div>
        </div>
        <Divider />
        <TabContext value={selectedTabIndex}>
          <Box>
            <TabList
              onChange={(e, v: string) => handleTabChange(e, v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={t("Simu.Hub.TabAnalyze")} value="0" />
              <Tab label={t("Simu.Hub.TabTutor")} value="1" />
            </TabList>
          </Box>
          <AnalyzePc
            rootStateRef={rootStateRef}
            opens={selectedTabIndex === "0"}
          />
          <Tutor opens={selectedTabIndex == "1"} />
        </TabContext>

        <div ref={detailsElemRef} className={classes.details}>
          {details}
        </div>
        <div className={classes.buttons}>
          <div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearClick}
              >
                {t("Common.Button.Clear")}
              </Button>
            </div>
          </div>
        </div>
        <div>&nbsp;</div>
      </div>
    </HubContext.Provider>
  );
};

export default Hub;
