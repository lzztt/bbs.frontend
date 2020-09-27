import React, { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";

import { cache, rest, validateResponse } from "../lib/common";

const set = new Set();

function Bookmark() {
  const [selected, setSelected] = useState(set);
  const [nodes, setNodes] = useState([]);
  const [page, setPage] = useState({});

  useEffect(() => {
    loadPage(1);
  }, []);

  const add = (id) => {
    const tmp = new Set(selected);
    tmp.add(id);
    setSelected(tmp);
  };
  const remove = (id) => {
    const tmp = new Set(selected);
    tmp.delete(id);
    setSelected(tmp);
  };
  const addAll = () => {
    setSelected(new Set(nodes.map((node) => node.id)));
  };
  const removeAll = () => {
    setSelected(new Set());
  };

  const loadPage = (i) => {
    const uid = cache.get("uid");
    rest.get("/api/bookmark/" + uid + "?p=" + i).then((data) => {
      if (validateResponse(data)) {
        setSelected(new Set());
        setNodes(data.nodes);
        setPage(data.pager);
      }
    });
  };

  const handleDelete = () => {
    if (selected.size === 0) {
      alert("您还没有选中任何帖子");
      return;
    }

    rest
      .delete("/api/bookmark/" + Array.from(selected).join(","))
      .then(function (data) {
        if (validateResponse(data)) {
          loadPage(page.pageNo);
        }
      });
  };

  const handlePageChange = (event, value) => {
    loadPage(value);
  };

  if (nodes.length === 0) {
    return "收藏夹里还是空空的。 看到感兴趣的帖子，可以点右上角按钮收藏。";
  }

  return (
    <>
      <ul className="bookmarks even_odd_parent">
        <li
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {selected.size === 0 ? (
            <CheckBoxOutlineBlankIcon onClick={addAll} />
          ) : selected.size === nodes.length ? (
            <CheckBoxIcon onClick={removeAll} />
          ) : (
            <IndeterminateCheckBoxIcon onClick={removeAll} />
          )}
          {selected.size > 0 && <DeleteIcon onClick={handleDelete} />}
          {page.pageCount > 1 && (
            <Pagination
              page={page.pageNo}
              count={page.pageCount}
              onChange={handlePageChange}
            />
          )}
        </li>
        {nodes.map((node) => (
          <li
            key={node.id}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {selected.has(node.id) ? (
              <CheckBoxIcon onClick={() => remove(node.id)} />
            ) : (
              <CheckBoxOutlineBlankIcon onClick={() => add(node.id)} />
            )}
            <a href={"/node/" + node.id}>{node.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Bookmark;
