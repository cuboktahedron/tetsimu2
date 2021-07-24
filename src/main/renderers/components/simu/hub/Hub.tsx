import { Button, Divider, TextField } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { RootContext } from "renderers/components/App";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { Tetromino } from "types/core";
import {
  AnalyzePcMessageRes,
  LogMessage,
  UnhandledMessage,
} from "types/simuMessages";
import { v4 as uuidv4 } from "uuid";

const useStyles = useSidePanelStyles({
  closes: {
    display: "none",
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

  React.useEffect(() => {
    return () => {
      if (webSocket !== null) {
        webSocket.close();
      }
    };
  }, [webSocket]);

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
    };

    ws.onclose = (e: CloseEvent) => {
      setWebSocket(null);

      const [details, setDetails] = detailsRef.current;
      setDetails(details.concat(`Connection closed.(${e.code}:${e.reason})`));
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

  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root, {
        [classes.closes]: !props.opens,
      })}
    >
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConnectHubClick}
              disabled={webSocket !== null}
            >
              Connect Hub
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
      <TextField
        fullWidth
        label="details"
        margin="dense"
        multiline
        InputProps={{
          readOnly: true,
        }}
        rows={8}
        value={detailsRef.current[0].join("\n")}
        variant="outlined"
      />
      <Divider />
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyzeClick}
        >
          Analyze
        </Button>
      </div>
    </div>
  );
};

export default Hub;
