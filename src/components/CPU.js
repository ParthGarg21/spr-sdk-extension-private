/*global chrome*/

import { useState, useEffect } from "react";

function CPU() {
  const [summary, setSummary] = useState([]);

  // function to send a messgae to the background script to send back the
  function sendMessage() {
    chrome.runtime.sendMessage("cpu-app");
  }

  useEffect(sendMessage, []);

  chrome.runtime.onMessage.addListener(function (message) {
    if (message.text === "cpu") {
      setSummary(message.cpu);
      console.log(summary);
    }
  });

  const totalTime = summary.totalTime;
  const usageTime = summary.usageTime;
  const utilization =
    summary.utilization === undefined
      ? ""
      : summary.utilization.toFixed(5) + "%";

  return (
    <div className="summary">
      <div className="info-con">
        <div className="info">
          <strong>Total Active Time</strong> <span>{totalTime}</span>
        </div>
        <div className="info">
          <strong>Usage Time</strong>
          <span>{usageTime}</span>
        </div>
        <div className="info">
          <strong>Utilization</strong> <span>{utilization}</span>
        </div>
      </div>
    </div>
  );
}

export default CPU;
