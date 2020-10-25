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

function Form({ onSubmit, children }) {
  const classes = useStyles();
  return (
    <form className={classes.root} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export default Form;
