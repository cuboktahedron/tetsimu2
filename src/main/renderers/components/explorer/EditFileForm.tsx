import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import React from "react";
import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType
} from "stores/ExplorerState";

export type EditFileFormProps = {
  file: ExplorerItemFile;
  open: boolean;
  onSave: (file: ExplorerItemFile) => void;
  onClose: () => void;
  parentFolder: ExplorerItemFolder;
};

const EditFileForm: React.FC<EditFileFormProps> = (props) => {
  const [formState, setFormState] = React.useState({
    name: props.file.name,
    description: props.file.description,
    parameters: props.file.parameters,
  });
  const [formErrorState, setFormErrorState] = React.useState({
    name: "",
    description: "",
    parameters: "",
  });

  React.useEffect(() => {
    setFormState({
      name: props.file.name,
      description: props.file.description,
      parameters: props.file.parameters,
    });

    setFormErrorState({
      name: "",
      description: "",
      parameters: "",
    });
  }, [props]);

  const itemNamesForValidation = React.useMemo(() => {
    return Object.values(props.parentFolder.items)
      .filter((item) => item.id !== props.file.id)
      .map((item) => item.name);
  }, [props]);

  const handleSaveClick = () => {
    props.onSave({
      ...formState,
      id: props.file.id,
      syncUrl: "",
      type: ExplorerItemType.File,
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

  const handleNameBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    let value = e.target.value.trim();

    setFormState({
      ...formState,
      name: value,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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

  const handleParametersBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    let value = e.target.value.trim();
    const index = value.indexOf("?");
    if (index !== -1) {
      value = value.substring(index + 1);
    }

    setFormState({
      ...formState,
      parameters: value,
    });
  };

  return (
    <Dialog
      classes={{ scrollPaper: "ignore-hotkey" }}
      fullWidth
      maxWidth="md"
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>Edit file</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          error={!!formErrorState.name}
          fullWidth
          helperText={formErrorState.name}
          label="name"
          margin="dense"
          value={formState.name}
          variant="outlined"
          onBlur={handleNameBlur}
          onChange={handleNameChange}
        />
        <TextField
          error={!!formErrorState.description}
          fullWidth
          helperText={formErrorState.description}
          label="description"
          margin="dense"
          multiline
          rows={8}
          value={formState.description}
          variant="outlined"
          onChange={(e) => handleOnChange("description", e)}
        />
        <TextField
          error={!!formErrorState.parameters}
          helperText={formErrorState.parameters}
          fullWidth
          label="parameters"
          margin="dense"
          multiline
          rows={6}
          value={formState.parameters}
          variant="outlined"
          onBlur={handleParametersBlur}
          onChange={(e) => handleOnChange("parameters", e)}
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

export default EditFileForm;
