import { Checkbox, FormControl, FormControlLabel } from "@material-ui/core";
import {
  changeNextBaseNo,
  changeNextsPattern,
  changeNoOfCycle
} from "ducks/edit/actions";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NumberCheckTextField from "renderers/components/ext/NumberWithLabelTextField";
import { EditStateTools } from "stores/EditState";
import { Action } from "types/core";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import NumberTextField from "../../ext/NumberTextField";
import TextFieldEx from "../../ext/TextFieldEx";

const MAX_NEXT_BASE_NO = 1000 - 7;

type NextSettingsProps = {
  dispatch: React.Dispatch<Action>;
  tools: EditStateTools;
};

const NextSettings = React.memo<NextSettingsProps>((props) => {
  const dispatch = props.dispatch;
  const [nextsPattern, setNextsPattern] = React.useState({
    errorText: "",
    value: props.tools.nextsPattern,
  });
  const { t } = useTranslation();

  useEffect(() => {
    setNextsPattern({
      errorText: "",
      value: props.tools.nextsPattern,
    });
  }, [props.tools.nextsPattern]);

  const handleNextsPatternChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.currentTarget.value;
    innerChangeNextsPattern(value);
  };

  const innerChangeNextsPattern = (nextsPattern: string): void => {
    const interpreter = new NextNotesInterpreter();
    try {
      interpreter.interpret(nextsPattern);
      setNextsPattern({
        errorText: "",
        value: nextsPattern,
      });

      dispatch(changeNextsPattern(nextsPattern));
    } catch (error) {
      let errorText;
      let errorObj = error as Error;
      if (errorObj && errorObj.message) {
        errorText = errorObj.message;
      } else {
        errorText = "ParseError";
      }
      setNextsPattern({
        errorText,
        value: nextsPattern,
      });
    }
  };

  const handleEndlessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const trimgedNextsPattern = nextsPattern.value.trimRight();
    let newNextsPattern;
    if (checked) {
      newNextsPattern = trimgedNextsPattern
        .substring(0, trimgedNextsPattern.length - 1)
        .trimRight();
    } else {
      newNextsPattern = trimgedNextsPattern + " $";
    }

    innerChangeNextsPattern(newNextsPattern);
  };

  const handleNextBaseNoChange = (value: number): void => {
    if (value !== props.tools.nextBaseNo) {
      dispatch(changeNextBaseNo(value));
    }
  };

  const handleNoOfCycleChange = (value: number): void => {
    if (value !== props.tools.noOfCycle) {
      dispatch(changeNoOfCycle(value));
    }
  };

  return (
    <React.Fragment>
      <div>
        <TextFieldEx
          error={!!nextsPattern.errorText}
          fullWidth
          label={t("Edit.Settings.NextPattern")}
          InputLabelProps={{
            shrink: true,
          }}
          value={nextsPattern.value}
          helperText={nextsPattern.errorText}
          variant="outlined"
          onChange={handleNextsPatternChange}
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={!nextsPattern.value.trimRight().endsWith("$")}
              onChange={handleEndlessChange}
            />
          }
          label={t("Edit.Settings.GenerateNextsEndlessly")}
        />
      </div>
      <div>
        <FormControl>
          <NumberTextField
            label={t("Edit.Settings.Nexts")}
            numberProps={{
              min: 1,
              max: MAX_NEXT_BASE_NO,
              change: handleNextBaseNoChange,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ minWidth: 100 }}
            value={"" + props.tools.nextBaseNo}
            variant="outlined"
          />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <NumberCheckTextField
            label={t("Edit.Settings.NoOfCycle")}
            checkLabel="Random"
            checked={props.tools.noOfCycle == 0}
            numberProps={{
              min: 0,
              max: 7,
              change: handleNoOfCycleChange,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ minWidth: 100 }}
            value={"" + props.tools.noOfCycle}
            variant="outlined"
          />
        </FormControl>
      </div>
    </React.Fragment>
  );
});

export default NextSettings;
