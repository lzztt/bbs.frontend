import React, { useState, useEffect } from "react";
import { rest, validateResponse } from "../lib/common";
import NavTab from "./NavTab";

const toDate = (timestamp) => new Date(timestamp * 1000).toLocaleDateString();

export default function Home() {
  const [ads, setAds] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    rest.get("/api/ad").then((data) => {
      if (validateResponse(data)) {
        setAds(data);
      }
    });
    rest.get("/api/adpayment").then((data) => {
      if (validateResponse(data)) {
        setPayments(data);
      }
    });
  }, []);

  return (
    <div>
      <NavTab />
      <table>
        <thead>
          <tr>
            <th>商家</th>
            <th>广告类型</th>
            <th>过期日期</th>
            <th>联系邮箱</th>
          </tr>
        </thead>
        <tbody className="even_odd_parent">
          {ads.map((ad) => (
            <tr key={ad.id}>
              <td>{ad.name}</td>
              <td>{ad.typeId === 1 ? "电子黄页" : "页顶广告"}</td>
              <td>{toDate(ad.expTime)}</td>
              <td>{ad.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <table>
        <thead>
          <tr>
            <th>商家</th>
            <th>金额</th>
            <th>付款日期</th>
            <th>过期日期</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody className="even_odd_parent">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.name}</td>
              <td>{payment.amount}</td>
              <td>{toDate(payment.payTime)}</td>
              <td>{toDate(payment.expTime)}</td>
              <td>{payment.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
