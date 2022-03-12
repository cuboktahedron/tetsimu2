import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import React from "react";

export type AddSyncProps = {
  open: boolean;
  onSync: (syncUrl: string) => void;
  onClose: () => void;
};

const AddSyncForm: React.FC<AddSyncProps> = (props) => {
  const [formState, setFormState] = React.useState({
    syncUrl: "",
  });
  const [formErrorState, setFormErrorState] = React.useState({
    syncUrl: "",
  });

  React.useEffect(() => {
    setFormState({
      syncUrl: "",
    });

    setFormErrorState({
      syncUrl: "",
    });
  }, [props]);

  const handleSyncClick = () => {
    props.onSync(formState.syncUrl);
  };

  const hasValidationError = (): boolean => {
    return Object.values(formErrorState).some((error) => !!error);
  };

  const validateSyncUrl = (value: string): boolean => {
    if (value.trim() === "") {
      setFormErrorState({
        ...formErrorState,
        syncUrl: "Must not be empty",
      });
      return false;
    }

    setFormErrorState({
      ...formErrorState,
      syncUrl: "",
    });
    return true;
  };

  const handleSyncUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setFormState({
      ...formState,
      syncUrl: value,
    });

    validateSyncUrl(value);
  };

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog
      fullScreen={small}
      fullWidth
      maxWidth="md"
      open={props.open}
      onClose={props.onClose}
      onTouchEnd={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <DialogTitle>Add sync</DialogTitle>
      <DialogContent>
        <TextField
          error={!!formErrorState.syncUrl}
          helperText={formErrorState.syncUrl}
          fullWidth
          label="syncUrl"
          margin="dense"
          value={formState.syncUrl}
          variant="outlined"
          onChange={handleSyncUrlChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          CLOSE
        </Button>
        <Button
          onClick={handleSyncClick}
          color="secondary"
          disabled={hasValidationError()}
        >
          SYNC
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSyncForm;
