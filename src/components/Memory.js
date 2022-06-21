/*global chrome*/

import { useState, useEffect } from "react";

function Memory() {
  const [summary, setSummary] = useState([]);

  function sendMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "memory");
    });
  }

  useEffect(sendMessage, []);

  chrome.runtime.onMessage.addListener(function (message) {
    if (message.txt === "memory") {
      console.log("bbb");
      setSummary(message.memory);
      //   console.log(summary);
    }
  });

  const currentAllocatedMemoryHeap = summary.currentAllocatedMemoryHeap;
  const memoryHeapSizeLimit = summary.memoryHeapSizeLimit;
  const totalMemoryHeapUsed = summary.totalMemoryHeapUsed;

  return (
    <div className="summary">
      <div className="info-con">
        <div className="info">
          <strong>Memory Limit</strong> <span>{memoryHeapSizeLimit}</span>
        </div>
        <div className="info">
          <strong>Allocated Memory</strong>
          <span>{currentAllocatedMemoryHeap}</span>
        </div>
        <div className="info">
          <strong>Memory Used</strong> <span>{totalMemoryHeapUsed}</span>
        </div>
      </div>
    </div>
  );
}

export default Memory;
