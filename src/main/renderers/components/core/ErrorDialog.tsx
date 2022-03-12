import { DialogContentText, DialogTitle } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import React from "react";

export type ErrorDialogProps = {
  title: string;
  message: string;
  onClose: () => void;
};

const ErrorDialog: React.FC<ErrorDialogProps> = (props) => {
  const handleClose = () => {
    props.onClose();
  };

  return (
    <div>
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ErrorDialog;
