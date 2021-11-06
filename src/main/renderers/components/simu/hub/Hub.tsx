import { Button, Divider } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { RootContext } from "renderers/components/App";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { Tetromino } from "types/core";
import {
  AnalyzePcMessageRes,
  LogMessage,
  UnhandledMessage
} from "types/simuMessages";
import { v4 as uuidv4 } from "uuid";

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
  const stateRef = useValueRef(rootState);

  const [webSocket, setWebSocket] = React.useState<WebSocket | null>(null);
  const detailsRef = useValueRef(React.useState<string[]>([]));
  const detailsElemRef = React.useRef<HTMLDivElement>(null);
  const [connectionEstablised, setConnectionEstablised] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (webSocket !== null) {
        webSocket.close();
      }
    };
  }, [webSocket]);

  React.useEffect(() => {
    const elem = detailsElemRef.current;
    if (elem === null) {
      return;
    }

    elem.scrollTop = elem.scrollHeight;
  }, [detailsRef.current]);

  const handleConnectHubClick = () => {
    if (webSocket !== null) {
      webSocket.close();
    }

    const external = rootState.simu.config.external;
    const url = `ws://${external.host}:${external.port}`;
    const [details, setDetails] = detailsRef.current;
    setDetails(details.concat(`Connect to ${url} ...`));

    let ws = new WebSocket(url);
    setWebSocket(ws);

    ws.onopen = () => {
      const [details, setDetails] = detailsRef.current;
      setDetails(details.concat("Connection established."));
      setConnectionEstablised(true);
    };

    ws.onclose = (e: CloseEvent) => {
      setWebSocket(null);

      const [details, setDetails] = detailsRef.current;
      setDetails(details.concat(`Connection closed.(${e.code}:${e.reason})`));
      setConnectionEstablised(false);
    };

    ws.onerror = () => {
      const [details, setDetails] = detailsRef.current;
      setDetails(details.concat(`Error occured.`));
    };

    ws.onmessage = (event: MessageEvent) => {
      const [details, setDetails] = detailsRef.current;

      const message = JSON.parse(event.data);
      if (message.Log) {
        const logMessage = message.Log as LogMessage;
        setDetails(details.concat(logMessage.body.message));
      } else if (message.AnalyzePc) {
        const analyzePc = message.AnalyzePc as AnalyzePcMessageRes;
        setDetails(details.concat(analyzePc.body.message));
      } else if (message.Unhandled) {
        const unhandled = message.Unhandled as UnhandledMessage;
        setDetails(details.concat(unhandled.body.message));
      }
    };
  };

  const handleAnalyzeClick = () => {
    if (webSocket === null) {
      return;
    }

    const simu = stateRef.current.simu;
    let field = simu.field.flatMap((row) => row);

    const settled = [
      simu.current.type,
      ...simu.nexts.settled.slice(0, simu.config.nextNum),
    ];

    if (simu.hold.type !== Tetromino.None) {
      settled.unshift(simu.hold.type);
    }

    const indexOfNone = settled.indexOf(Tetromino.None);
    const sliceEnd = indexOfNone === -1 ? settled.length : indexOfNone + 1;

    const tetrominoToPattern = Object.fromEntries(
      Object.entries(Tetromino).map(([key, value]) => {
        return [value, key];
      })
    );

    const nexts = settled
      .slice(0, sliceEnd)
      .map((type) => tetrominoToPattern[type])
      .join("");

    const analyzeRequest = {
      AnalyzePc: {
        header: {
          message_id: uuidv4(),
        },
        body: {
          field,
          nexts,
        },
      },
    };
    webSocket.send(JSON.stringify(analyzeRequest));
  };

  const handleClearClick = () => {
    const [, setDetails] = detailsRef.current;
    setDetails([]);
  };

  const isReadyToConnect = () => {
    return (
      webSocket !== null ||
      !rootState.simu.config.external.host ||
      !rootState.simu.config.external.port
    );
  };

  const details = React.useMemo(() => {
    return detailsRef.current[0].flatMap((detail) => {
      return detail.split("\n").map((line) => {
        return <div>{line}</div>;
      });
    });
  }, [detailsRef.current[0]]);

  const classes = useStyles();

  return (
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
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyzeClick}
              disabled={!connectionEstablised}
            >
              Analyze
            </Button>
          </div>
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
  );
};

export default Hub;
