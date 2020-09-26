import React, { useState } from "react";
import { validateResponse } from "../lib/common";
import "./Form.css";

export default function Add() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [typeId, setTypeId] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/api/ad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        typeId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (validateResponse(data)) {
          alert("广告添加成功:" + data.name + " : " + data.email);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <fieldset>
        <label>名称</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>类别</label>
        <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
          <option value="?"></option>
          <option value="1">电子黄页</option>
          <option value="2">页顶</option>
        </select>
      </fieldset>
      <fieldset>
        <button type="submit">添加广告</button>
      </fieldset>
    </form>
  );
}
