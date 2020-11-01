import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import { rest, session, toAutoTime, validateResponse } from "../lib/common";
import NavTab from "./NavTab";
import Selector from "./Selector";
import "./topic_list.css";

const set = new Set();

function Mailbox() {
  const { mailbox } = useParams();
  const [selected, setSelected] = useState(set);
  const [messages, setMessages] = useState(null);
  const [page, setPage] = useState({});

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailbox]);

  session.set("mailbox", mailbox);

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

  if (!Array.isArray(messages)) {
    return "";
  }

  if (messages.length === 0) {
    return "还没有短信可以显示，开始发送站内短信吧。";
  }

  const Action = () => (
    <Selector
      {...{
        count: selected.size,
        total: messages.length,
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
      <NavTab mailbox={mailbox} />
      <Action />
      <div className="topic_list even_odd_parent">
        {messages.map((msg) => (
          <div key={msg.mid}>
            <span>
              {selected.has(msg.mid) ? (
                <CheckBoxIcon onClick={() => remove(msg.mid)} />
              ) : (
                <CheckBoxOutlineBlankIcon
                  onClick={() => add(msg.mid)}
                  color="disabled"
                />
              )}
              <Link to={"/user/pm/" + msg.mid}>
                {msg.isNew > 0 ? <b>{msg.body}</b> : msg.body}
              </Link>
            </span>
            <Link to={"/user/" + msg.uid}>{msg.user}</Link>
            <time>{toAutoTime(msg.time)}</time>
          </div>
        ))}
      </div>
      <Action />
    </>
  );
}

export default Mailbox;
