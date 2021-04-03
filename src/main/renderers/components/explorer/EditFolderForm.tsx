import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React from "react";
import { ExplorerItemFolder, ExplorerItemType } from "stores/ExplorerState";

export type EditFolderFormProps = {
  folder: ExplorerItemFolder;
  open: boolean;
  onSave: (file: ExplorerItemFolder) => void;
  onClose: () => void;
  parentFolder: ExplorerItemFolder;
};

const EditFolderForm: React.FC<EditFolderFormProps> = (props) => {
  const [formState, setFormState] = React.useState({
    name: props.folder.name,
    description: props.folder.description,
  });
  const [formErrorState, setFormErrorState] = React.useState({
    name: "",
    description: "",
    parameters: "",
  });

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
      syncUrl: "",
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
        name: "Must not be empty",
      });
      return false;
    }

    if (itemNamesForValidation.includes(value)) {
      setFormErrorState({
        ...formErrorState,
        name: "This name is already used",
      });
      return false;
    }

    setFormErrorState({
      ...formErrorState,
      name: "",
    });
    return true;
  };

  const handleNameOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (validateName(value)) {
      setFormState({
        ...formState,
        name: value,
      });
    }
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

  return (
    <Dialog
      classes={{ scrollPaper: "ignore-hotkey" }}
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>Edit file</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          defaultValue={formState.name}
          error={!!formErrorState.name}
          fullWidth
          helperText={formErrorState.name}
          label="name"
          margin="dense"
          variant="outlined"
          onChange={handleNameOnChange}
        />
        <TextField
          defaultValue={formState.description}
          error={!!formErrorState.description}
          fullWidth
          helperText={formErrorState.description}
          label="description"
          margin="dense"
          multiline
          rows={4}
          variant="outlined"
          onChange={(e) => handleOnChange("description", e)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Close
        </Button>
        <Button
          onClick={handleSaveClick}
          color="secondary"
          disabled={hasValidationError()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFolderForm;
