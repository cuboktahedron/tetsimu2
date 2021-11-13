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
import { RootState } from "stores/RootState";
import { Action, TetsimuMode } from "types/core";
import { SimuConductor } from "utils/tetsimu/simu/simuConductor";
import SimuUrl from "utils/tetsimu/simu/simuUrl";
import { RootContext } from "../../App";
import TextFieldEx from "../../ext/TextFieldEx";

const useStyles = useSidePanelStyles();

type ToolsProps = {
  opens: boolean;
};

const Tools: React.FC<ToolsProps> = (props) => {
  if (!props.opens) {
    return null;
  }

  const { state: rootState, dispatch } = React.useContext(RootContext);
  const stateRef = useValueRef(rootState);

  return <InnerTools dispatch={dispatch} stateRef={stateRef} {...props} />;
};

type InnerToolsProps = {
  dispatch: React.Dispatch<Action>;
  stateRef: React.MutableRefObject<RootState>;
} & ToolsProps;

const InnerTools = React.memo<InnerToolsProps>((props) => {
  if (!props.opens) {
    return null;
  }

  const rootStateRef = props.stateRef;
  const dispatch = props.dispatch;
  const [stateUrl, setStateUrl] = React.useState("");

  const handleEditClick = () => {
    const state = rootStateRef.current.simu;
    dispatch(simuToEditMode(state));
  };

  const handleReplayClick = () => {
    const state = rootStateRef.current.simu;
    dispatch(simuToReplayMode(state));
  };

  const handleEditNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Edit));
  };

  const handleReplayNoResetClick = () => {
    dispatch(changeTetsimuMode(TetsimuMode.Replay));
  };

  const handleUrlClick = () => {
    const state = rootStateRef.current.simu;
    const url = new SimuUrl().fromState(state);
    setStateUrl(url);
  };

  const handleClearClick = () => {
    const state = rootStateRef.current.simu;
    dispatch(clearSimu(new SimuConductor(state)));
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
