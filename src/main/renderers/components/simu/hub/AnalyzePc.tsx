import { Button } from "@material-ui/core";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { RootState } from "stores/RootState";
import { Tetromino } from "types/core";
import { AnalyzePcMessageRes } from "types/simuMessages";
import { appendDetails, HubContext } from "utils/tetsimu/simu/hubActions";
import { HubMessageEventTypes } from "utils/tetsimu/simu/hubEventEmitter";
import { v4 as uuidv4 } from "uuid";

const useStyles = useSidePanelStyles({});

type AnalyzePcProps = {
  rootStateRef: React.MutableRefObject<RootState>;
};

const AnalyzePc: React.FC<AnalyzePcProps> = (props) => {
  const { state, dispatch: hubDispatch } = React.useContext(HubContext);
  const stateRef = useValueRef(state);

  React.useEffect(() => {
    stateRef.current.hubEventEmitter.addListener(
      HubMessageEventTypes.AnalyzePc,
      handleAnalyzePcMessage
    );
  }, [stateRef.current.hubEventEmitter]);

  const handleAnalyzePcMessage = (message: AnalyzePcMessageRes) => {
    hubDispatch(appendDetails(message.body.message));
  };

  const handleAnalyzeClick = () => {
    if (state.webSocket === null) {
      return;
    }

    const simu = props.rootStateRef.current.simu;
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

    state.webSocket.send(JSON.stringify(analyzeRequest));
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyzeClick}
              disabled={state.webSocket == null}
            >
              Analyze
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AnalyzePc;
