import { makeStyles, Theme } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    "& p": {
      margin: theme.spacing(1),
    },
  },
}));

export type HelpProps = {
  opens: boolean;
};

const Help: React.FC<HelpProps> = (props) => {
  if (!props.opens) {
    return null;
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2>Tetsimu2</h2>
      <p>version: 2.04</p>
      <div>
        <h3>author</h3>
        <p>cuboktahedron</p>
        <ul>
          <li>
            <a href="https://twitter.com/cubokta" target="_blank">
              twitter(@cubokta)
            </a>
          </li>
          <li>
            <a href="https://github.com/cuboktahedron/tetsimu2" target="_blank">
              source
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cuboktahedron/tetsimu2/wiki"
              target="_blank"
            >
              document(ja)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
