import {
  IconButton,
  makeStyles,
  SvgIcon,
  SvgIconProps,
  Theme,
} from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import GetAppIcon from "@material-ui/icons/GetApp";
import SyncIcon from "@material-ui/icons/Sync";
import TreeView from "@material-ui/lab/TreeView";
import { getOrderedItems } from "ducks/explorer/selectors";
import React from "react";
import { useExplorerEventHandler } from "renderers/hooks/explorer/useExplorerEventHandler";
import { ExplorerItemType, initialExplorerState } from "stores/ExplorerState";
import { Action } from "types/core";
import { ExplorerEventType } from "utils/tetsimu/explorer/explorerEvent";
import { RootContext } from "../App";
import Folder from "./Folder";

export const ExplorerContext = React.createContext({
  state: initialExplorerState,
  dispatch: (_: Action) => {},
});

const MinusSquare: React.FC = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
};

const PlusSquare: React.FC = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& .MuiIconButton-root": {
      padding: theme.spacing(0.5),
    },
  },
}));

const Explorer: React.FC = () => {
  const { state: rootState, dispatch } = React.useContext(RootContext);
  const state = rootState.explorer;
  const classes = useStyles();
  const explorerEventHandler = useExplorerEventHandler();

  const handleNewFolderClick = () => {
    explorerEventHandler({
      type: ExplorerEventType.FolderAdd,
      payload: {
        newFolderName: "NewFolder",
        dest: "/",
      },
    });
  };

  const rootItems = getOrderedItems(state.rootFolder.items);
  const rootFolders = rootItems.map((root) => {
    if (root.type === ExplorerItemType.Folder) {
      return (
        <Folder
          key={root.id}
          {...root}
          path={`/${root.name}`}
          eventHandler={explorerEventHandler}
        />
      );
    } else {
      return "";
    }
  });

  return (
    <ExplorerContext.Provider value={{ state, dispatch }}>
      <div className={classes.root}>
        <div>
          <IconButton onClick={handleNewFolderClick}>
            <CreateNewFolderIcon />
          </IconButton>
          <IconButton>
            <GetAppIcon />
          </IconButton>
          <IconButton>
            <CloudDownloadIcon />
          </IconButton>
          <IconButton>
            <SyncIcon />
          </IconButton>
        </div>

        <TreeView
          className={`${classes.root} ignore-hotkey`}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
        >
          {rootFolders}
        </TreeView>
      </div>
    </ExplorerContext.Provider>
  );
};

export default Explorer;
