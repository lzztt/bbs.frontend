import React, { useState, useRef } from "react";

import { rest, validateResponse } from "../lib/common";

function MsgEditor({ replyTo, topicMid, onClose }) {
  const [message, setMessage] = useState("");
  const textInput = useRef(null);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message.length < 5) {
      alert("短信内容最少为5个字符");
      textInput.current.focus();
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
          onClose(data);
        }
      });
  };

  return (
    <form onSubmit={sendMessage} onReset={() => onClose(null)}>
      <fieldset>
        <label>收信人</label>
        {replyTo.username}
      </fieldset>
      <fieldset>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={textInput}
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
