import { Button, Divider } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import {
  changeTetsimuMode,
  simuToEditMode,
  simuToReplayMode
} from "ducks/root/actions";
import { clearSimu } from "ducks/simu/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { SimuState } from "stores/SimuState";
import { Action, TetsimuMode } from "types/core";
import { SimuConductor } from "utils/tetsimu/simu/simuConductor";
import SimuUrl from "utils/tetsimu/simu/simuUrl";
import { RootContext } from "../App";
import TextFieldEx from "../ext/TextFieldEx";

const useStyles = useSidePanelStyles();

type ToolsProps = {
  opens: boolean;
};

const Tools: React.FC<ToolsProps> = (props) => {
  if (!props.opens) {
    return null;
  }

  const { state: rootState, dispatch } = React.useContext(RootContext);
  const stateRef = useValueRef(rootState.simu);

  return <InnerTools dispatch={dispatch} stateRef={stateRef} {...props} />;
};

type InnerToolsProps = {
  dispatch: React.Dispatch<Action>;
  stateRef: React.MutableRefObject<SimuState>;
} & ToolsProps;

const InnerTools = React.memo<InnerToolsProps>((props) => {
  if (!props.opens) {
    return null;
  }

  const stateRef = props.stateRef;
  const dispatch = props.dispatch;
  const [stateUrl, setStateUrl] = React.useState("");

  const handleEditClick = () => {
    dispatch(simuToEditMode(stateRef.current));
  };

  const handleReplayClick = () => {
    dispatch(simuToReplayMode(stateRef.current));
  };

  const handleEditNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Edit));
  };

  const handleReplayNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Replay));
  };

  const handleUrlClick = () => {
    const url = new SimuUrl().fromState(stateRef.current);
    setStateUrl(url);
  };

  const handleClearClick = () => {
    dispatch(clearSimu(new SimuConductor(stateRef.current)));
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditClick}
            >
              EDIT
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditNoResetClick}
            >
              <EditIcon />
            </Button>
          </div>
        </div>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReplayClick}
            >
              REPLAY
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReplayNoResetClick}
            >
              <PlayCircleOutlineIcon />
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <div>
        <Button variant="contained" color="primary" onClick={handleUrlClick}>
          URL
        </Button>
      </div>
      <div>
        <TextFieldEx
          fullWidth
          label="url"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            readOnly: true,
          }}
          value={stateUrl}
          variant="outlined"
        />
      </div>
      <Button variant="contained" color="secondary" onClick={handleClearClick}>
        CLEAR
      </Button>
    </div>
  );
});

export default Tools;
