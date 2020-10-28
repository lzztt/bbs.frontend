import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { rest, session, validateResponse, toAutoTime } from "../lib/common";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import NavTab from "./NavTab";
import MsgEditor from "./MsgEditor";

function Message() {
  const [messages, setMessages] = useState(null);
  const [replyTo, setReplyTo] = useState({});
  const { messageId } = useParams();
  const history = useHistory();

  useEffect(() => {
    rest.get("/api/message/" + messageId).then((data) => {
      setMessages(data.msgs);
      setReplyTo(data.replyTo);
    });
  }, [messageId]);

  const mailbox = session.get("mailbox") || "inbox";

  const handleDelete = (index) => {
    var answer = window.confirm(
      index === 0 ? "整个对话的所有消息将被删除？" : "此条消息将被删除？"
    );
    if (answer) {
      rest.delete("/api/message/" + messages[index].id).then((data) => {
        if (validateResponse(data)) {
          if (index === 0) {
            history.replace("/mailbox/" + mailbox);
          } else {
            const tmp = [...messages];
            tmp.splice(index, 1);
            setMessages(tmp);
          }
        }
      });
    }
  };

  const handleReply = () => {
    window.app.openMsgEditor({
      toUser: replyTo,
      topicMid: messageId,
      onClose: updateMessages,
    });
  };

  const updateMessages = (newMessage) => {
    if (newMessage) {
      setMessages([...messages, newMessage]);
    }
  };

  if (!Array.isArray(messages)) {
    return "";
  }

  if (messages.length === 0) {
    return "还没有短信可以显示，开始发送站内短信吧。";
  }

  return (
    <>
      <NavTab mailbox={mailbox} />
      <article className="topic">
        {messages.map((msg, index) => (
          <section key={msg.id}>
            <header>
              <Link to={"/user/" + msg.uid}>{msg.username}</Link>
              {toAutoTime(msg.time)}
            </header>
            <p>
              {msg.body}{" "}
              <DeleteForeverIcon onClick={() => handleDelete(index)} />
            </p>
          </section>
        ))}
        <div>
          <button onClick={handleReply}>
            <EditIcon />
            回复
          </button>
        </div>
      </article>
      <MsgEditor />
    </>
  );
}

export default Message;
