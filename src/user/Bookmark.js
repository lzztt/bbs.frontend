import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Selector from "../pm/Selector";
import { cache, rest, toAutoTime, validateResponse } from "../lib/common";

import "../pm/topic_list.css";

const set = new Set();

function Bookmark() {
  const [selected, setSelected] = useState(set);
  const [nodes, setNodes] = useState(null);
  const [page, setPage] = useState({});

  useEffect(() => {
    loadPage(1);
  }, []);

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

  if (!Array.isArray(nodes)) {
    return "";
  }

  if (nodes.length === 0) {
    return "收藏夹里还是空空的。 看到感兴趣的帖子，可以点右上角按钮收藏。";
  }

  const Action = () => (
    <Selector
      {...{
        count: selected.size,
        total: nodes.length,
        page,
        addAll,
        removeAll,
        handleDelete,
        handlePageChange,
      }}
    />
  );

  return (
    <>
      <Action />
      <div className="topic_list even_odd_parent">
        {nodes.map((node) => (
          <div key={node.id}>
            <span>
              {selected.has(node.id) ? (
                <CheckBoxIcon onClick={() => remove(node.id)} />
              ) : (
                <CheckBoxOutlineBlankIcon
                  onClick={() => add(node.id)}
                  color="disabled"
                />
              )}
              <a href={"/node/" + node.id}>{node.title}</a>
            </span>
            <Link to={"/user/" + node.uid}>{node.username}</Link>
            <span>{toAutoTime(node.last_comment_time)}</span>
          </div>
        ))}
      </div>
      <Action />
    </>
  );
}

export default Bookmark;
