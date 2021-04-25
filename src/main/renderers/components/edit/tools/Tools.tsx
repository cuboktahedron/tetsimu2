import { Button, Divider } from "@material-ui/core";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import { clearEdit } from "ducks/edit/actions";
import { changeTetsimuMode, editToSimuMode } from "ducks/root/actions";
import React from "react";
import { useSidePanelStyles } from "renderers/hooks/useSidePanelStyles";
import { useValueRef } from "renderers/hooks/useValueRef";
import { EditState, EditStateTools } from "stores/EditState";
import { Action, FieldState, TetsimuMode } from "types/core";
import EditUrl from "utils/tetsimu/edit/editUrl";
import { RootContext } from "../../App";
import TextFieldEx from "../../ext/TextFieldEx";
import FieldOperator from "./FieldOperator";
import NextSettings from "./NextSettings";

type ToolsProps = {
  opens: boolean;
};

const Tools: React.FC<ToolsProps> = (props) => {
  if (!props.opens) {
    return null;
  }

  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.edit;
  const stateRef = useValueRef(state);

  return (
    <InnerTools
      dispatch={dispatch}
      field={state.field}
      tools={state.tools}
      stateRef={stateRef}
      {...props}
    />
  );
};

const useStyles = useSidePanelStyles();

type InnerToolsProps = {
  dispatch: React.Dispatch<Action>;
  field: FieldState;
  tools: EditStateTools;
  stateRef: React.MutableRefObject<EditState>;
} & ToolsProps;

const InnerTools = React.memo<InnerToolsProps>((props) => {
  if (!props.opens) {
    return null;
  }

  const stateRef = props.stateRef;
  const dispatch = props.dispatch;
  const [stateUrl, setStateUrl] = React.useState("");

  const handleUrlClick = () => {
    const url = new EditUrl().fromState(stateRef.current);
    setStateUrl(url);
  };

  const handleClearClick = () => {
    dispatch(clearEdit());
  };

  const handleSimuClick = React.useCallback(() => {
    dispatch(editToSimuMode(stateRef.current));
  }, []);

  const handleEditNoResetClick = React.useCallback(() => {
    dispatch(changeTetsimuMode(TetsimuMode.Simu));
  }, []);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSimuClick}
            >
              SIMU
            </Button>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditNoResetClick}
            >
              <SportsEsportsIcon />
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <NextSettings dispatch={dispatch} tools={props.tools} />
      <Divider />
      <div className={classes.buttons}>
        <FieldOperator dispatch={dispatch} field={props.field} />
      </div>
      {React.useMemo(
        () => (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUrlClick}
            >
              URL
            </Button>
          </div>
        ),
        []
      )}
      {React.useMemo(
        () => (
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
        ),
        [stateUrl]
      )}
      {React.useMemo(
        () => (
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearClick}
            >
              CLEAR
            </Button>
          </div>
        ),
        []
      )}
    </div>
  );
});

export default Tools;
