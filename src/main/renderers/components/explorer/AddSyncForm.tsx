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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        syncUrl: t("Explorer.AddSync.Message.MustNotBeEmpty"),
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
      <DialogTitle>{t("Explorer.AddSync.Title")}</DialogTitle>
      <DialogContent>
        <TextField
          error={!!formErrorState.syncUrl}
          helperText={formErrorState.syncUrl}
          fullWidth
          label={t("Explorer.AddSync.SyncUrl")}
          margin="dense"
          value={formState.syncUrl}
          variant="outlined"
          onChange={handleSyncUrlChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          {t("Common.Button.Close")}
        </Button>
        <Button
          onClick={handleSyncClick}
          color="secondary"
          disabled={hasValidationError()}
        >
          {t("Common.Button.Sync")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSyncForm;
