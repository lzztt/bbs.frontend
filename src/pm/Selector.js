import React from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";

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
