import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  InputAdornment
} from "@material-ui/core";
import { changeConfig, changeGarbageLevel } from "ducks/simu/actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { Action } from "types/core";
import { SimuConfig } from "types/simu";
import NumberTextField from "../../ext/NumberTextField";

const useStyles = useSidePanelStyles({
  formControl: {
    minWidth: 120,
  },
});

type GarbageSettingsProps = {
  config: SimuConfig;
  dispatch: React.Dispatch<Action>;
};

const GarbageSettings = React.memo<GarbageSettingsProps>((props) => {
  const { config, dispatch } = props;
  const { t } = useTranslation();

  const handleRiseUpRateFirstChange = (value: number): void => {
    if (value !== config.riseUpRate.first) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            first: value,
          },
        })
      );
    }
  };

  const handleRiseUpRateSecondChange = (value: number): void => {
    if (value !== config.riseUpRate.second) {
      dispatch(
        changeConfig({
          ...config,
          riseUpRate: {
            ...config.riseUpRate,
            second: value,
          },
        })
      );
    }
  };

  const handleOffsetRangeChange = (value: number) => {
    dispatch(
      changeConfig({
        ...config,
        offsetRange: value,
      })
    );
  };

  const handleGeneratesGarbagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      changeConfig({
        ...config,
        garbage: {
          ...config.garbage,
          generates: e.target.checked,
        },
      })
    );
  };

  const handleGenerateGarbagesLevelChange = (value: number): void => {
    if (value !== config.garbage.level) {
      dispatch(changeGarbageLevel(value));
    }
  };

  const handleGenerateGarbageFactorChange = (
    paramName: keyof typeof config.garbage,
    value: number
  ): void => {
    if (value !== config.garbage[paramName]) {
      dispatch(
        changeConfig({
          ...config,
          garbage: {
            ...config.garbage,
            level: null,
            [paramName]: value,
          },
        })
      );
    }
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <FormLabel component="legend" className={classes.settingGroupTitle}>
          {t("Simu.Settings.Garbage.Title")}
        </FormLabel>

        <div className={classes.section}>
          <NumberTextField
            label={t("Simu.Settings.Garbage.Rate.First")}
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 0,
              max: 100,
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              change: handleRiseUpRateFirstChange,
            }}
            value={"" + config.riseUpRate.first}
            variant="outlined"
            style={{ marginRight: 4 }}
          />
          <NumberTextField
            label={t("Simu.Settings.Garbage.Rate.Second")}
            InputLabelProps={{
              shrink: true,
            }}
            numberProps={{
              min: 0,
              max: 100,
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
              change: handleRiseUpRateSecondChange,
            }}
            value={"" + config.riseUpRate.second}
            variant="outlined"
          />
        </div>
      </div>
      <div className={classes.section}>
        <NumberTextField
          className={classes.formControl}
          label={t("Simu.Settings.Garbage.OffsetRange")}
          InputLabelProps={{
            shrink: true,
          }}
          numberProps={{
            min: 0,
            max: 12,
            change: handleOffsetRangeChange,
          }}
          value={"" + config.offsetRange}
          variant="outlined"
          style={{ minWidth: 120 }}
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.garbage.generates}
              onChange={handleGeneratesGarbagesChange}
            />
          }
          label={t("Simu.Settings.Garbage.GenerateGarbages")}
        />
      </div>
      <div className={classes.section}>
        <NumberTextField
          label={t("Simu.Settings.Garbage.Level")}
          InputLabelProps={{
            shrink: true,
          }}
          numberProps={{
            min: 0,
            max: 100,
            change: handleGenerateGarbagesLevelChange,
          }}
          value={config.garbage.level !== null ? "" + config.garbage.level : ""}
          variant="outlined"
          disabled={!config.garbage.generates}
        />
      </div>
      <div>{t("Simu.Settings.Garbage.Factors")}</div>
      <div className={classes.section}>
        <NumberTextField
          label="a1"
          InputLabelProps={{
            shrink: true,
          }}
          numberProps={{
            min: 0,
            max: 150,
            change: (value) => handleGenerateGarbageFactorChange("a1", value),
          }}
          value={"" + config.garbage.a1}
          variant="outlined"
          disabled={!config.garbage.generates}
          style={{ marginRight: 4 }}
        />
        <NumberTextField
          label="a2"
          InputLabelProps={{
            shrink: true,
          }}
          numberProps={{
            min: 1,
            max: 100,
            change: (value) => handleGenerateGarbageFactorChange("a2", value),
          }}
          value={"" + config.garbage.a2}
          variant="outlined"
          disabled={!config.garbage.generates}
          style={{ marginRight: 4 }}
        />
        <NumberTextField
          label="b1"
          InputLabelProps={{
            shrink: true,
          }}
          numberProps={{
            min: 0,
            max: 150,
            change: (value) => handleGenerateGarbageFactorChange("b1", value),
          }}
          value={"" + config.garbage.b1}
          variant="outlined"
          disabled={!config.garbage.generates}
          style={{ marginRight: 4 }}
        />
        <NumberTextField
          label="b2"
          InputLabelProps={{
            shrink: true,
          }}
          numberProps={{
            min: 1,
            max: 100,
            change: (value) => handleGenerateGarbageFactorChange("b2", value),
          }}
          value={"" + config.garbage.b2}
          variant="outlined"
          disabled={!config.garbage.generates}
        />
      </div>
    </div>
  );
});

export default GarbageSettings;
