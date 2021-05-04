import {
  createStyles,
  IconButton,
  makeStyles,
  Menu,
  Theme
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FlashOnSharpIcon from "@material-ui/icons/FlashOnSharp";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { TreeItem, TreeItemProps } from "@material-ui/lab";
import React from "react";
import { useDrag } from "react-dnd";
import {
  ExplorerItemFile,
  ExplorerItemFolder,
  ExplorerItemType
} from "stores/ExplorerState";
import { DragItemTypes as DragItemTypes } from "types/explorer";
import {
  ExplorerEvent,
  ExplorerEventType
} from "utils/tetsimu/explorer/explorerEvent";
import EditFileForm from "./EditFileForm";

export type FileProps = {
  eventHandler: React.MutableRefObject<(event: ExplorerEvent) => void>;
  parentFolder: ExplorerItemFolder;
  path: string;
} & ExplorerItemFile &
  TreeItemProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    file: {
      "&.MuiTreeItem-root.Mui-selected": {
        "& > .MuiTreeItem-content": {
          "& $menuIcon": {
            visibility: "visible",
          },
        },
      },

      "&.MuiTreeItem-root:focus": {
        "& > .MuiTreeItem-content": {
          "& $menuIcon": {
            visibility: "visible",
          },
        },
      },

      "&.MuiTreeItem-root": {
        "& > .MuiTreeItem-content:hover": {
          "& $menuIcon": {
            visibility: "visible",
          },
        },
      },
    },

    labelRoot: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0.5, 0),

      "& .MuiIconButton-root": {
        padding: theme.spacing(0.5),
      },
    },

    menuIcon: {
      visibility: "hidden",
    },
  })
);

const File: React.FC<FileProps> = (props) => {
  const [opensEditForm, setOpensEditForm] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const [, drag] = useDrag(
    () => ({
      item: {
        id: props.id,
        name: props.name,
        nodeId: props.nodeId,
        path: props.path,
        type: ExplorerItemType.File,
      },
      type: DragItemTypes.File,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [props.id, props.name, props.nodeId, props.path]
  );

  const handleApplyClick = () => {
    applyParameters();
  };

  const handleEditClick = () => {
    openEditForm();
  };

  const openEditForm = () => {
    setOpensEditForm(true);
  };

  const handleRemoveFileClick = () => {
    removeFile();
    return false;
  };

  const removeFile = () => {
    props.eventHandler.current({
      type: ExplorerEventType.FileRemove,
      payload: {
        pathToDelete: props.path,
      },
    });
  };

  const handleEditClose = () => {
    setOpensEditForm(false);
  };

  const handleEditSave = (file: ExplorerItemFile) => {
    props.eventHandler.current({
      type: ExplorerEventType.FileSave,
      payload: {
        file,
        pathToSave: props.path,
      },
    });
    setOpensEditForm(false);
  };

  const applyParameters = () => {
    if (props.parameters) {
      props.eventHandler.current({
        type: ExplorerEventType.FileLoad,
        payload: {
          parameters: props.parameters,
        },
      });
    }
  };

  const handleItemDoubleClick = () => {
    applyParameters();
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" && props.parameters) {
      props.eventHandler.current({
        type: ExplorerEventType.FileLoad,
        payload: {
          parameters: props.parameters,
        },
      });
      e.preventDefault();
    } else if (e.key === "Delete") {
      removeFile();
      e.preventDefault();
    } else if (e.key === "F2") {
      openEditForm();
      e.preventDefault();
    }
  };

  const handleOpenMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setMenuAnchorEl(event.currentTarget);
  };

  const classes = useStyles();
  const { path, eventHandler: eventHandler, parentFolder, ...file } = props;

  return (
    <div ref={drag}>
      <TreeItem
        className={`${classes.file} ignore-hotkey`}
        nodeId={props.nodeId}
        label={
          <div
            className={classes.labelRoot}
            onDoubleClick={handleItemDoubleClick}
          >
            {props.name}
            <div style={{ marginLeft: "auto" }}>
              <IconButton
                className={classes.menuIcon}
                onClick={handleOpenMenuClick}
              >
                <MoreHorizIcon />
              </IconButton>
            </div>
          </div>
        }
        onKeyDown={handleItemKeyDown}
      />
      <FileMenu
        anchorEl={menuAnchorEl}
        onApplyClick={handleApplyClick}
        onEditClick={handleEditClick}
        onRemoveFileClick={handleRemoveFileClick}
        onClose={() => setMenuAnchorEl(null)}
      />
      <EditFileForm
        file={file}
        parentFolder={parentFolder}
        open={opensEditForm}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </div>
  );
};

type FileMenuProps = {
  anchorEl: Element | null;
  onApplyClick: () => void;
  onClose: () => void;
  onEditClick: () => void;
  onRemoveFileClick: () => void;
};

const FileMenu = React.memo<FileMenuProps>((props) => {
  const handleMenuClick = (handler: () => void) => {
    return () => {
      handler();
      props.onClose();
    };
  };

  return (
    <Menu
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
    >
      <div>
        <IconButton onClick={handleMenuClick(props.onApplyClick)}>
          <FlashOnSharpIcon />
        </IconButton>
        <IconButton onClick={handleMenuClick(props.onEditClick)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleMenuClick(props.onRemoveFileClick)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Menu>
  );
});

export default File;
