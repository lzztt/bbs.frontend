import React from "react";
import { styled } from '@mui/material/styles';

const FormRoot = styled("form")({
  maxWidth: "500px",
  margin: "1rem auto",
  padding: "1rem",

  "& > *": {
    marginBottom: "0.5rem",
  },
});


function Form({ onSubmit, children }) {
  return (
    <FormRoot onSubmit={onSubmit}>{children}</FormRoot>
  );
}

export default Form;
