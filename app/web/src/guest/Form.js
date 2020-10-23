import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "500px",
    margin: "1rem auto",
    padding: "1rem",
    "& > *": {
      marginBottom: "0.5rem",
    },
  },
}));

function Form({ children }) {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
}

export default Form;
