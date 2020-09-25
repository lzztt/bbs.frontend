import React, { useState, useEffect } from "react";
import { validateResponse } from "../lib/common";

const toDate = (timestamp) => new Date(timestamp * 1000).toLocaleDateString();

export default function Home() {
  const [ads, setAds] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/api/ad")
      .then((response) => response.json())
      .then((data) => {
        if (validateResponse(data)) {
          setAds(data);
        }
      });
    fetch("/api/adpayment")
      .then((response) => response.json())
      .then((data) => {
        if (validateResponse(data)) {
          setPayments(data);
        }
      });
  }, []);

  return (
    <div>
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
            <tr>
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
            <tr>
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
