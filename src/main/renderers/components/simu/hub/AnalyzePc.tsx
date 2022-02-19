import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import NumberCheckTextField from "renderers/components/ext/NumberCheckTextField";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { RootState } from "stores/RootState";
import {
  FieldCellValue,
  FieldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  Tetromino
} from "types/core";
import { AnalyzePcDropType } from "types/simu";
import {
  AnalyzePcMessageRes,
  AnalyzePcMessageResBodyItem
} from "types/simuMessages";
import {
  AnalyzedPcItem,
  appendAnalyzedItems,
  changeAnalyzePcSettings,
  HubContext
} from "utils/tetsimu/simu/hubActions";
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

  formControl: {
    minWidth: 120,
  },
});

type AnalyzePcProps = {
  opens: boolean;
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

    return () => {
      stateRef.current.hubEventEmitter.removeListener(
        HubMessageEventTypes.AnalyzePc,
        handleAnalyzePcMessage
      );
    };
  }, [stateRef.current.hubEventEmitter]);

  const handleAnalyzePcMessage = (message: AnalyzePcMessageRes) => {
    const uniqueItems = convertAnalyzedItems(message.body.unique_items);
    const minimalItems = convertAnalyzedItems(message.body.minimal_items);

    hubDispatch(appendAnalyzedItems(uniqueItems, minimalItems));
  };

  const convertAnalyzedItems = (
    items: AnalyzePcMessageResBodyItem[]
  ): AnalyzedPcItem[] => {
    const fieldForFill = new Array(MAX_FIELD_HEIGHT * MAX_FIELD_WIDTH).fill(
      FieldCellValue.None
    );

    return items.map((item) => {
      return {
        title: item.title,
        details: item.detail.map((detail) => {
          const mergedField = detail.field.concat(fieldForFill);
          const field: FieldState = [];
          for (let i = 0; i < MAX_FIELD_HEIGHT; i++) {
            field.push(mergedField.slice(i * 10, (i + 1) * 10));
          }

          return {
            settles: detail.settles,
            field,
          };
        }),
      };
    });
  };

  const handleClearLineChange = (value: number) => {
    hubDispatch(
      changeAnalyzePcSettings({
        ...stateRef.current.analyzePc,
        clearLine: value,
      })
    );
  };

  const handleUseHoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hubDispatch(
      changeAnalyzePcSettings({
        ...stateRef.current.analyzePc,
        useHold: e.target.checked,
      })
    );
  };

  const handleDropTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    hubDispatch(
      changeAnalyzePcSettings({
        ...stateRef.current.analyzePc,
        dropType: e.target.value as AnalyzePcDropType,
      })
    );
  };

  const handleAnalyzeClick = () => {
    if (stateRef.current.webSocket === null) {
      return;
    }

    const simu = props.rootStateRef.current.simu;
    let field = simu.field.flatMap((row) => row);

    const settled = [
      simu.current.type,
      ...simu.nexts.settled.slice(0, simu.config.nextNum),
    ];

    if (
      simu.hold.type !== Tetromino.None &&
      stateRef.current.analyzePc.useHold
    ) {
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

    const analyzePc = stateRef.current.analyzePc;
    const analyzeRequest: AnalyzeMessage = {
      AnalyzePc: {
        header: {
          message_id: uuidv4(),
        },
        body: {
          field,
          nexts,
          clear_line: analyzePc.clearLine,
          use_hold: analyzePc.useHold,
          drop_type: analyzePc.dropType,
        },
      },
    };

    stateRef.current.webSocket.send(JSON.stringify(analyzeRequest));
  };

  const classes = useStyles();

  return (
    <div
      className={clsx(classes.root2, {
        [classes.opens]: props.opens,
      })}
    >
      <div className={classes.buttons} style={{ marginBottom: 12 }}>
        <div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyzeClick}
              disabled={stateRef.current.webSocket == null}
            >
              Analyze
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.section}>
        <NumberCheckTextField
          label="clear line"
          checkLabel="Auto"
          checked={stateRef.current.analyzePc.clearLine == 0}
          InputLabelProps={{
            shrink: true,
          }}
          numberProps={{
            min: 0,
            max: 10,
            change: handleClearLineChange,
          }}
          value={"" + stateRef.current.analyzePc.clearLine}
          variant="outlined"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={stateRef.current.analyzePc.useHold}
              onChange={handleUseHoldChange}
            />
          }
          label="Use hold"
        />
      </div>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel>drop type</InputLabel>
          <Select
            onChange={handleDropTypeChange}
            value={stateRef.current.analyzePc.dropType}
          >
            <MenuItem value={AnalyzePcDropType.SoftDrop}>SoftDrop</MenuItem>
            <MenuItem value={AnalyzePcDropType.HardDrop}>HardDrop</MenuItem>
            <MenuItem value={AnalyzePcDropType.Tss}>Tss</MenuItem>
            <MenuItem value={AnalyzePcDropType.Tsd}>Tsd</MenuItem>
            <MenuItem value={AnalyzePcDropType.Tst}>Tst</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

type AnalyzeMessage = {
  AnalyzePc: {
    header: {
      message_id: string;
    };
    body: {
      field: FieldCellValue[];
      nexts: string;
      clear_line: number;
      use_hold: boolean;
      drop_type: typeof AnalyzePcDropType[keyof typeof AnalyzePcDropType];
    };
  };
};

export default AnalyzePc;
