import { Button } from "@material-ui/core";
import { setSettleSteps } from "ducks/simu/actions";
import { getNextAttacks, getUrgentAttack } from "ducks/simu/selectors";
import React from "react";
import { RootContext } from "renderers/components/App";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { SimuState } from "stores/SimuState";
import {
  BtbState,
  Direction,
  FieldCellValue,
  MAX_NEXTS_NUM,
  ReplayStepType,
  SpinType,
  Tetromino
} from "types/core";
import { SettleStep } from "types/simu";
import {
  InitTutorMessageRes,
  Step,
  StepsMessage,
  TermTutorMessageRes
} from "types/simuMessages";
import { appendDetails, HubContext } from "utils/tetsimu/simu/hubActions";
import { HubMessageEventTypes } from "utils/tetsimu/simu/hubEventEmitter";
import { v4 as uuidv4 } from "uuid";

const useStyles = useSidePanelStyles({});

const Tutor: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const { state, dispatch: hubDispatch } = React.useContext(HubContext);
  const [isReady, setIsReady] = React.useState(false);
  const [lastMoveTime, setLastMoveTime] = React.useState(Number.MIN_VALUE);
  const [prevSimuState, setPrevSimuState] =
    React.useState<SimuState | null>(null);
  const [prevRequestMessageId, setPrevRequestMessageId] =
    React.useState<string>(uuidv4());
  const [prevSteps, setPrevSteps] = React.useState<Step[]>([]);
  const stateRef = useValueRef({
    rootState,
    state,
    isReady,
    lastMoveTime,
    prevSimuState,
    prevRequestMessageId,
    prevSteps,
  });

  React.useEffect(() => {
    stateRef.current.state.hubEventEmitter.addListener(
      HubMessageEventTypes.InitTuror,
      handleInitTutorMessage
    );

    stateRef.current.state.hubEventEmitter.addListener(
      HubMessageEventTypes.Steps,
      handleStepMessage
    );

    stateRef.current.state.hubEventEmitter.addListener(
      HubMessageEventTypes.TermTuror,
      handleTermTutorMessage
    );
  }, [stateRef.current.state.hubEventEmitter]);

  React.useEffect(() => {
    if (stateRef.current.state.webSocket === null) {
      setIsReady(false);
    }
  }, [stateRef.current.state.webSocket]);

  React.useEffect(() => {
    setLastMoveTime(new Date().getTime());
  }, [stateRef.current.rootState.simu.current]);

  React.useEffect(() => {
    if (
      stateRef.current.state.webSocket === null ||
      !stateRef.current.isReady
    ) {
      return;
    }

    if (needsNotifyStatus()) {
      notifyStatus();
    } else {
      moveNext();
    }
  }, [
    stateRef.current.rootState.simu.seed,
    stateRef.current.rootState.simu.step,
    stateRef.current.isReady,
  ]);

  const needsNotifyStatus = (): boolean => {
    // TODO: 攻撃を受けた場合はtrueを返す。

    // const simu = stateRef.current.rootState.simu;
    // const prevSimu = stateRef.current.prevSimuState;
    // if (!prevSimu) {
    //   return true;
    // }

    // return simu.step !== prevSimu.step + 1;
    return true;
  };

  const notifyStatus = () => {
    if (
      stateRef.current.state.webSocket === null ||
      !stateRef.current.isReady
    ) {
      return;
    }

    const simu = stateRef.current.rootState.simu;
    const field = simu.field.flatMap((row) => row);
    const settled = [
      simu.current.type,
      ...simu.nexts.settled.slice(0, simu.config.nextNum),
    ];

    const tetrominoToPattern = Object.fromEntries(
      Object.entries(Tetromino).map(([key, value]) => {
        return [value, key];
      })
    );

    const nexts = settled
      .filter((type) => type != Tetromino.None)
      .map((type) => tetrominoToPattern[type])
      .join("");

    const garbageInfo = [
      getUrgentAttack(simu) ?? 0,
      ...getNextAttacks(simu.garbages, simu.config.nextNum).concat([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]),
    ].slice(0, MAX_NEXTS_NUM + 1);

    const notifyStatusMessage: NotifyStatusMessage = {
      NotifyStatus: {
        header: {
          message_id: uuidv4(),
        },
        body: {
          field,
          nexts,
          garbage_info: garbageInfo,
          can_hold: simu.hold.canHold,
          hold_type: simu.hold.type,
          ren: simu.ren,
          is_btb: simu.btbState == BtbState.Btb,
        },
      },
    };

    setPrevSimuState(stateRef.current.rootState.simu);
    setPrevRequestMessageId(notifyStatusMessage.NotifyStatus.header.message_id);
    stateRef.current.state.webSocket.send(JSON.stringify(notifyStatusMessage));
  };

  const moveNext = () => {
    if (
      stateRef.current.state.webSocket === null ||
      !stateRef.current.isReady ||
      stateRef.current.prevSimuState == null
    ) {
      return;
    }

    const tetrominoToPattern = Object.fromEntries(
      Object.entries(Tetromino).map(([key, value]) => {
        return [value, key];
      })
    );

    const simu = stateRef.current.rootState.simu;
    const currentNexts = simu.nexts.settled
      .slice(0)
      .filter((type) => type !== Tetromino.None)
      .map((type) => tetrominoToPattern[type])
      .join("");

    const replayStep = simu.replaySteps[simu.replaySteps.length - 1];
    const moveNextMessage = ((): MoveNextMessage | null => {
      if (replayStep.type == ReplayStepType.Hold) {
        let additionalNexts = "";
        if (stateRef.current.prevSimuState.hold.type == Tetromino.None) {
          additionalNexts = currentNexts
            .slice(0, simu.config.nextNum)
            .slice(-1);
        }

        return {
          MoveNext: {
            header: {
              message_id: uuidv4(),
            },
            body: {
              Hold: {
                additional_nexts: additionalNexts,
              },
            },
          },
        };
      } else {
        const dropStep = simu.replaySteps[simu.replaySteps.length - 2];
        if (dropStep.type != ReplayStepType.Drop) {
          return null;
        }

        const additionalNexts = currentNexts
          .slice(0, simu.config.nextNum)
          .slice(-1);

        return {
          MoveNext: {
            header: {
              message_id: uuidv4(),
            },
            body: {
              Drop: {
                type: stateRef.current.prevSimuState.current.type,
                x: dropStep.pos.x,
                y: dropStep.pos.y,
                dir: dropStep.dir,
                spin_type: dropStep.spinType,
                additional_nexts: additionalNexts,
              },
            },
          },
        };
      }
    })();

    if (!moveNextMessage) {
      return;
    }

    setPrevSimuState(stateRef.current.rootState.simu);
    setPrevRequestMessageId(moveNextMessage.MoveNext.header.message_id);
    stateRef.current.state.webSocket.send(JSON.stringify(moveNextMessage));
  };

  const handleInitTutorMessage = (_message: InitTutorMessageRes) => {
    setIsReady(true);
    hubDispatch(appendDetails("Tutor is ready."));
  };

  const handleStepMessage = (message: StepsMessage) => {
    if (
      stateRef.current.prevRequestMessageId != message.body.request_message_id
    ) {
      return;
    }

    const firstStep = message.body.steps[0];
    const prevFirstStep = stateRef.current.prevSteps[0];

    if (new Date().getTime() < stateRef.current.lastMoveTime + 500) {
      if (!prevFirstStep && firstStep !== prevFirstStep) {
        return;
      }
    }

    setLastMoveTime(new Date().getTime());
    setPrevSteps(message.body.steps);

    const steps: SettleStep[] = message.body.steps.map((step) => {
      return {
        type: step.type,
        dir: step.dir,
        pos: {
          x: step.x,
          y: step.y,
        },
      };
    });

    dispatch(setSettleSteps(steps));
  };

  const handleTermTutorMessage = (_message: TermTutorMessageRes) => {
    setIsReady(false);
    hubDispatch(appendDetails("Tutor terminated gracefully."));
  };

  const handleStartClick = () => {
    if (stateRef.current.state.webSocket === null) {
      return;
    }

    const initTutorRequest = {
      InitTutor: {
        header: {
          message_id: uuidv4(),
        },
        body: {},
      },
    };

    stateRef.current.state.webSocket.send(JSON.stringify(initTutorRequest));
  };

  const handleStopClick = () => {
    if (stateRef.current.state.webSocket === null) {
      return;
    }

    const termTutorRequest = {
      TermTutor: {
        header: {
          message_id: uuidv4(),
        },
        body: {},
      },
    };

    stateRef.current.state.webSocket.send(JSON.stringify(termTutorRequest));
  };

  const classes = useStyles();

  const startButton = (() => {
    if (stateRef.current.isReady) {
      return "";
    } else {
      return (
        <div key="start">
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartClick}
              disabled={stateRef.current.state.webSocket == null}
            >
              Start
            </Button>
          </div>
        </div>
      );
    }
  })();

  const stopButton = (() => {
    if (stateRef.current.isReady) {
      return (
        <div key="stop">
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStopClick}
              disabled={stateRef.current.state.webSocket == null}
            >
              Stop
            </Button>
          </div>
        </div>
      );
    } else {
      return "";
    }
  })();

  return (
    <React.Fragment>
      <div className={classes.buttons}>
        {startButton}
        {stopButton}
      </div>
    </React.Fragment>
  );
};

type NotifyStatusMessage = {
  NotifyStatus: {
    header: {
      message_id: string;
    };
    body: {
      field: FieldCellValue[];
      nexts: string;
      garbage_info: number[];
      can_hold: boolean;
      hold_type: Tetromino;
      ren: number;
      is_btb: boolean;
    };
  };
};

type MoveNextMessage = {
  MoveNext: {
    header: {
      message_id: string;
    };
    body:
      | {
          Drop: {
            type: Tetromino;
            x: number;
            y: number;
            dir: Direction;
            spin_type: SpinType;
            additional_nexts: string;
          };
        }
      | {
          Hold: {
            additional_nexts: string;
          };
        };
  };
};

export default Tutor;
