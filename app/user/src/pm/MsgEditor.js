import React, { useState } from "react";

import { rest, validateResponse } from "../lib/common";

function MsgEditor({ replyTo, topicMid, closeEditor }) {
  const [message, setMessage] = useState("");

  const sendMessage = (event) => {
    event.preventDefault();

    if (message.length < 5) {
      alert("短信内容最少为5个字符");
      return;
    }

    rest
      .post("/api/message", {
        toUid: replyTo.id,
        body: message,
        topicMid,
      })
      .then(function (data) {
        if (validateResponse(data)) {
          closeEditor(data);
        }
      });
  };

  return (
    <form onSubmit={sendMessage} onReset={() => closeEditor(null)}>
      <fieldset>
        <label>收信人</label>
        {replyTo.username}
      </fieldset>
      <fieldset>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <button type="submit">发送</button>
        <button type="reset">取消</button>
      </fieldset>
    </form>
  );
}

export default MsgEditor;
