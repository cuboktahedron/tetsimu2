import { Button } from "@material-ui/core";
import clsx from "clsx";
import { setSettleSteps } from "ducks/simu/actions";
import { getNextAttacks, getUrgentAttack } from "ducks/simu/selectors";
import React from "react";
import { useTranslation } from "react-i18next";
import { RootContext } from "renderers/components/App";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { SimuState } from "stores/SimuState";
import { BtbState, FieldCellValue, MAX_NEXTS_NUM, Tetromino } from "types/core";
import { SettleStep } from "types/simu";
import {
  InitTutorMessageRes,
  StepsMessage,
  TermTutorMessageRes,
  Tetsimu2MessageVersion,
} from "types/simuMessages";
import { appendDetails, HubContext } from "utils/tetsimu/simu/hubActions";
import { HubMessageEventTypes } from "utils/tetsimu/simu/hubEventEmitter";
import { v4 as uuidv4 } from "uuid";

const useStyles = useSidePanelStyles({
  root2: {
    border: "solid 1px grey",
    display: "none",
    padding: 8,
  },

  opens: {
    display: "block",
  },
});

type AnalyzePcProps = {
  opens: boolean;
};

const Tutor: React.FC<AnalyzePcProps> = (props) => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const { state, dispatch: hubDispatch } = React.useContext(HubContext);
  const [isReady, setIsReady] = React.useState(false);
  const [lastMoveTime, setLastMoveTime] = React.useState(Number.MIN_VALUE);
  const [prevSimuState, setPrevSimuState] =
    React.useState<SimuState | null>(null);
  const [prevRequestMessageId, setPrevRequestMessageId] =
    React.useState<string>(uuidv4());
  const stateRef = useValueRef({
    rootState,
    state,
    isReady,
    lastMoveTime,
    prevSimuState,
    prevRequestMessageId,
  });
  const { t } = useTranslation();

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

    return () => {
      stateRef.current.state.hubEventEmitter.removeListener(
        HubMessageEventTypes.InitTuror,
        handleInitTutorMessage
      );

      stateRef.current.state.hubEventEmitter.removeListener(
        HubMessageEventTypes.Steps,
        handleStepMessage
      );

      stateRef.current.state.hubEventEmitter.removeListener(
        HubMessageEventTypes.TermTuror,
        handleTermTutorMessage
      );
    };
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

    notifyStatus();
  }, [
    stateRef.current.rootState.simu.seed,
    stateRef.current.rootState.simu.step,
    stateRef.current.isReady,
  ]);

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
          version: Tetsimu2MessageVersion,
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

  const handleInitTutorMessage = (_message: InitTutorMessageRes) => {
    setIsReady(true);
    hubDispatch(appendDetails(t("Simu.Hub.Tutor.Message.Ready")));
  };

  const handleStepMessage = (message: StepsMessage) => {
    if (
      stateRef.current.prevRequestMessageId != message.body.request_message_id
    ) {
      return;
    }

    const firstStep = message.body.steps[0];
    const settleFirstStep = stateRef.current.rootState.simu.settleSteps[0];
    if (
      !!settleFirstStep &&
      (firstStep.dir !== settleFirstStep.dir ||
        firstStep.type !== settleFirstStep.type ||
        firstStep.x !== settleFirstStep.pos.x ||
        firstStep.y !== settleFirstStep.pos.y)
    ) {
      if (new Date().getTime() < stateRef.current.lastMoveTime + 250) {
        return;
      }
    }

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
    hubDispatch(
      appendDetails(t("Simu.Hub.Tutor.Message.TerminatedGracefully"))
    );
  };

  const handleStartClick = () => {
    if (stateRef.current.state.webSocket === null) {
      return;
    }

    const initTutorRequest: InitTutorMessage = {
      InitTutor: {
        header: {
          version: Tetsimu2MessageVersion,
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

    const termTutorRequest: TermTutorMessage = {
      TermTutor: {
        header: {
          version: Tetsimu2MessageVersion,
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
              {t("Simu.Hub.Tutor.Button.Start")}
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
              {t("Simu.Hub.Tutor.Button.Stop")}
            </Button>
          </div>
        </div>
      );
    } else {
      return "";
    }
  })();

  return (
    <div
      className={clsx(classes.root2, {
        [classes.opens]: props.opens,
      })}
    >
      <div className={classes.buttons}>
        {startButton}
        {stopButton}
      </div>
    </div>
  );
};

type InitTutorMessage = {
  InitTutor: {
    header: {
      version: string;
      message_id: string;
    };
    body: {};
  };
};

type TermTutorMessage = {
  TermTutor: {
    header: {
      version: string;
      message_id: string;
    };
    body: {};
  };
};

type NotifyStatusMessage = {
  NotifyStatus: {
    header: {
      version: string;
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

export default Tutor;
