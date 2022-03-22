import React from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from '@mui/material/Pagination';

import "./selector.css";

function Selector({
  count,
  total,
  page,
  addAll,
  removeAll,
  handleDelete,
  handlePageChange,
}) {
  return (
    <div className="selector">
      {count === 0 ? (
        <CheckBoxOutlineBlankIcon onClick={addAll} color="disabled" />
      ) : count === total ? (
        <CheckBoxIcon onClick={removeAll} />
      ) : (
        <IndeterminateCheckBoxIcon onClick={removeAll} />
      )}
      {count > 0 && <DeleteIcon onClick={handleDelete} />}
      {page.pageCount > 1 && (
        <Pagination
          page={page.pageNo}
          count={page.pageCount}
          onChange={handlePageChange}
          size="small"
        />
      )}
    </div>
  );
}

export default Selector;
