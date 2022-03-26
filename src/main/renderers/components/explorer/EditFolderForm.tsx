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
import { ExplorerItemFolder, ExplorerItemType } from "stores/ExplorerState";
import { ExplorerIds } from "types/explorer";

export type EditFolderFormProps = {
  folder: ExplorerItemFolder;
  open: boolean;
  onSave: (file: ExplorerItemFolder) => void;
  onClose: () => void;
  parentFolder: ExplorerItemFolder;
};

const EditFolderForm: React.FC<EditFolderFormProps> = (props) => {
  const [formState, setFormState] = React.useState({
    description: props.folder.description,
    name: props.folder.name,
  });
  const [formErrorState, setFormErrorState] = React.useState({
    description: "",
    name: "",
  });
  const { t } = useTranslation();

  React.useEffect(() => {
    setFormState({
      description: props.folder.description,
      name: props.folder.name,
    });

    setFormErrorState({
      description: "",
      name: "",
    });
  }, [props]);

  const itemNamesForValidation = React.useMemo(() => {
    return Object.values(props.parentFolder.items)
      .filter((item) => item.id !== props.folder.id)
      .map((item) => item.name);
  }, [props]);

  const handleSaveClick = () => {
    props.onSave({
      ...formState,
      id: props.folder.id,
      items: props.folder.items,
      syncUrl: props.folder.syncUrl,
      type: ExplorerItemType.Folder,
    });
  };

  const hasValidationError = (): boolean => {
    return Object.values(formErrorState).some((error) => !!error);
  };

  const validateName = (value: string): boolean => {
    if (value.trim() === "") {
      setFormErrorState({
        ...formErrorState,
        name: t("Explorer.EditFolder.Message.MustNotBeEmpty"),
      });
      return false;
    }

    if (itemNamesForValidation.includes(value)) {
      setFormErrorState({
        ...formErrorState,
        name: t("Explorer.EditFolder.Message.NameIsAlreadyUsed"),
      });
      return false;
    }

    setFormErrorState({
      ...formErrorState,
      name: "",
    });
    return true;
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();

    setFormState({
      ...formState,
      name: value,
    });

    validateName(value);
  };

  const handleOnChange = (
    keyName: keyof typeof formState,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [keyName]: e.target.value,
    });
  };

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("xs"));
  const isTempFolder = props.folder.id === ExplorerIds.TempFolder;

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
      <DialogTitle>{t("Explorer.EditFolder.Title")}</DialogTitle>
      <DialogContent>
        <TextField
          defaultValue={props.folder.id}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          label="id"
          margin="dense"
          variant="filled"
        />
        <TextField
          autoFocus
          error={!!formErrorState.name}
          fullWidth
          helperText={formErrorState.name}
          InputProps={{
            readOnly: isTempFolder,
          }}
          label={t("Explorer.EditFolder.Name")}
          margin="dense"
          value={formState.name}
          variant={isTempFolder ? "filled" : "outlined"}
          onBlur={handleNameBlur}
          onChange={(e) => handleOnChange("name", e)}
        />
        <TextField
          error={!!formErrorState.description}
          fullWidth
          helperText={formErrorState.description}
          InputProps={{
            readOnly: isTempFolder,
          }}
          label={t("Explorer.EditFolder.Description")}
          margin="dense"
          multiline
          rows={8}
          value={
            isTempFolder
              ? t("Explorer.TempFolderDescription")
              : formState.description
          }
          variant={isTempFolder ? "filled" : "outlined"}
          onChange={(e) => handleOnChange("description", e)}
        />
        <TextField
          defaultValue={props.folder.syncUrl}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          label={t("Explorer.EditFolder.SyncUrl")}
          margin="dense"
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          {t("Common.Button.Close")}
        </Button>
        <Button
          onClick={handleSaveClick}
          color="secondary"
          disabled={hasValidationError() || isTempFolder}
        >
          {t("Common.Button.Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFolderForm;
