import { Button } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { buildUpField, flipField, slideField } from "ducks/edit/actions";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLongTap } from "renderers/hooks/useLongTap";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { Action, FieldState } from "types/core";

const useStyles = useSidePanelStyles();

type FieldOperatorProps = {
  dispatch: React.Dispatch<Action>;
  field: FieldState;
};

const FieldOperator = React.memo<FieldOperatorProps>((props) => {
  const dispatch = props.dispatch;
  const { t } = useTranslation();

  const handleFlipClick = () => {
    dispatch(flipField(props.field));
  };

  const handleSlideLeft = () => {
    dispatch(slideField(props.field, -1));
  };

  const handleSlideRight = () => {
    dispatch(slideField(props.field, 1));
  };

  const handleBuildUp = () => {
    dispatch(buildUpField(props.field, 1));
  };

  const handleBuildDown = () => {
    dispatch(buildUpField(props.field, -1));
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              className={classes.longTapButton}
              variant="contained"
              color="primary"
              {...useLongTap({
                onPress: handleSlideLeft,
                onLongPress: handleSlideLeft,
                interval1: 300,
                interval2: 100,
              })}
            >
              <ArrowLeftIcon />
            </Button>
          </div>
          <div>
            <Button
              className={classes.longTapButton}
              variant="contained"
              color="primary"
              {...useLongTap({
                onPress: handleBuildUp,
                onLongPress: handleBuildUp,
                interval1: 300,
                interval2: 100,
              })}
            >
              <ArrowDropUpIcon />
            </Button>
          </div>
          <div>
            <Button
              className={classes.longTapButton}
              variant="contained"
              color="primary"
              {...useLongTap({
                onPress: handleBuildDown,
                onLongPress: handleBuildDown,
                interval1: 300,
                interval2: 100,
              })}
            >
              <ArrowDropDownIcon />
            </Button>
          </div>
          <div>
            <Button
              className={classes.longTapButton}
              variant="contained"
              color="primary"
              {...useLongTap({
                onPress: handleSlideRight,
                onLongPress: handleSlideRight,
                interval1: 300,
                interval2: 100,
              })}
            >
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={handleFlipClick}>
          {t("Edit.Tool.Button.Flip")}
        </Button>
      </div>
    </React.Fragment>
  );
});

export default FieldOperator;
