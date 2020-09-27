import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { rest, session, toLocalDateTimeString } from "../lib/common";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import NavTab from "./NavTab";

const data = {
  msgs: [
    {
      id: 761600,
      time: 1562539042,
      body: "Houston BBS is not working.",
      uid: 18817,
      username: "xkxmin",
      avatar: "/data/avatars/avatar01.jpg",
    },
    {
      id: 761677,
      time: 1562563491,
      body: "嗯，谢谢告知\n现在已经修好了",
      uid: 1,
      username: "admin",
      avatar: "/data/avatars/1-100.png",
    },
  ],
  replyTo: { id: 18817, username: "xkxmin" },
};

function Message() {
  const { messageId } = useParams();
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState({});
  const [editor, setEditor] = useState(false);

  useEffect(() => {
    if (data) {
      setMessages(data.msgs);
      setReplyTo(data.replyTo);
      return;
    }
    rest.get("/api/message/" + messageId).then((data) => {
      setMessages(data.msgs);
      setReplyTo(data.replyTo);
    });
  }, [messageId]);

  const mailbox = session.get("mailbox") || "inbox";

  const handleDelete = (id) => {
    console.log(id);
  };
  const handleReply = () => {
    setEditor(true);
  };

  if (editor) {
    return "editor";
  }

  return (
    <>
      <NavTab mailbox={mailbox} />
      <article className="topic">
        {messages.map((msg) => (
          <section key={msg.id}>
            <header>
              <Link to={"/app/user/" + msg.uid}>{msg.username}</Link>
              {toLocalDateTimeString(new Date(msg.time * 1000))}
            </header>
            <p>
              {msg.body}{" "}
              <DeleteForeverIcon onClick={() => handleDelete(msg.id)} />
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
    </>
  );
}

export default Message;
