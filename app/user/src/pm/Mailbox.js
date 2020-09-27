import React, { useState, useEffect } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";

import { rest, session, toLocalDateString, validateResponse } from "../lib/common";
import NavTab from "./NavTab";

const set = new Set();

function Mailbox() {
  const { mailbox } = useParams();
  const [selected, setSelected] = useState(set);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState({});

  useEffect(() => {
    loadPage(1);
  }, [mailbox]);

  session.set('mailbox', mailbox);

  const loadPage = (i) => {
    rest.get("/api/message/" + mailbox + "?p=" + i).then((data) => {
      if (validateResponse(data)) {
        setSelected(new Set());
        setMessages(data.msgs);
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
    setSelected(new Set(messages.map((msg) => msg.mid)));
  };
  const removeAll = () => {
    setSelected(new Set());
  };

  const handleDelete = () => {
    if (selected.size === 0) {
      alert("您还没有选中任何短信");
      return;
    }

    rest
      .delete("/api/message/" + Array.from(selected).join(","))
      .then(function (data) {
        if (validateResponse(data)) {
          loadPage(page.pageNo);
        }
      });
  };

  const handlePageChange = (event, value) => {
    loadPage(value);
  };

  if (messages.length === 0) {
    return "还没有短信可以显示，开始发送站内短信吧。";
  }

  return (
    <>
      <NavTab mailbox={mailbox} />
      <ul className="pm_list even_odd_parent">
        <li>
          {selected.size === 0 ? (
            <CheckBoxOutlineBlankIcon onClick={addAll} />
          ) : selected.size === messages.length ? (
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
        <li>
          <span>短信</span>
          <span>联系人</span>
          <span>时间</span>
        </li>
        {messages.map((msg) => (
          <li key={msg.mid}>
            <span>
              {selected.has(msg.mid) ? (
                <CheckBoxIcon onClick={() => remove(msg.mid)} />
              ) : (
                <CheckBoxOutlineBlankIcon onClick={() => add(msg.mid)} />
              )}
              <Link to={"/pm/" + msg.mid}>{msg.body}</Link>
            </span>
            <span>
              <Link to={"/app/user/" + msg.uid}>{msg.user}</Link>
            </span>
            <span>{toLocalDateString(new Date(msg.time * 1000))}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Mailbox;
