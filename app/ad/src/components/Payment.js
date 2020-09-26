import React, { useState, useEffect } from "react";
import { rest, validateResponse } from "../lib/common";
import "./Form.css";

export default function Payment() {
  const [ads, setAds] = useState([]);
  const [adId, setAdId] = useState("");
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState("");
  const [adTime, setAdTime] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    rest.get("/api/ad/name").then((data) => {
      if (validateResponse(data)) {
        setAds(data);
      }
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    rest
      .post("/api/adpayment", {
        adId,
        amount,
        time,
        adTime,
        comment,
      })
      .then((data) => {
        if (validateResponse(data)) {
          var expDate = new Date(data.expTime * 1000);
          var expTime =
            expDate.getFullYear() +
            "-" +
            (expDate.getMonth() + 1) +
            "-" +
            expDate.getDate();
          alert(
            "付款添加成功:" +
              data.adName +
              " : $" +
              data.amount +
              "\n广告有效期更新至: " +
              expTime
          );
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} acceptCharset="UTF-8" autoComplete="off">
      <fieldset>
        <label>广告名称</label>
        <select value={adId} onChange={(e) => setAdId(e.target.value)}>
          <option value="?"></option>
          {ads.map((a) => (
            <option value={a.id}>{a.name}</option>
          ))}
        </select>
      </fieldset>
      <fieldset>
        <label>金额 ($)</label>
        <input
          type="number"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>付款时间</label>
        <input
          type="date"
          required
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>广告时间 (月)</label>
        <input
          type="number"
          required
          value={adTime}
          onChange={(e) => setAdTime(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label>备注</label>
        <textarea
          rows="5"
          cols="50"
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <button type="submit">添加付款</button>
      </fieldset>
    </form>
  );
}
