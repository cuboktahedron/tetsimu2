import { createStyles, makeStyles, Theme } from "@material-ui/core";
import {
  ClassNameMap,
  StyleRules,
  Styles
} from "@material-ui/core/styles/withStyles";

type SidePanelProperties =
  | "buttons"
  | "longTapButton"
  | "root"
  | "section"
  | "settingGroupTitle";

export const useSidePanelStyles = <
  ClassKey extends string = string,
  Props extends {} = object
>(
  style?: Styles<Theme, {}, ClassKey>
): ((props?: any) => ClassNameMap<SidePanelProperties | ClassKey>) => {
  return makeStyles((theme: Theme) => {
    const defaultStyle = {
      root: {
        background: "white",
        flexGrow: 1,
        padding: 8,

        "& > hr": {
          marginBottom: theme.spacing(1),
          marginTop: theme.spacing(1),
        },

        "& > div": {
          marginBottom: theme.spacing(1),
        },
      },

      section: {
        "& > div": {
          marginBottom: theme.spacing(1),
        },
      },

      buttons: {
        display: "flex",
        flexDirection: "column",

        "& > div": {
          display: "flex",
          flexWrap: "wrap",

          "& + div": {
            marginTop: theme.spacing(1),
          },

          "& > div": {
            marginRight: theme.spacing(1),
          },
        },
      },

      settingGroupTitle: {
        fontWeight: "bold",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
      },

      longTapButton: {
        touchAction: "none",
      },
    };

    const mergeStyles = Object.assign({}, defaultStyle, {
      ...style,
    });

    return createStyles(mergeStyles as StyleRules<string, Props>);
  }) as (props?: any) => ClassNameMap<SidePanelProperties | ClassKey>;
};
