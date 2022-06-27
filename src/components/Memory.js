/**
 * Component that renders the memory statistics by communicating with the content script.
 * Whenever the component is rendered, the fresh summary is generated.
 */

/*global chrome*/

import { useState, useEffect } from "react";

function Memory() {
  // State to store the memory summary
  const [summary, setSummary] = useState([]);

  // Function to send a message to the content script to get the memory stats
  function sendMessage() {
    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "memory");
    });

    // Function to listen to the incoming message containing memory info
    function listener(message) {
      // If we get the desired message from the content script, then update the memory summay
      if (message.text === "memory") {
        // removing the listener to avoid unwanted redundant and repeated listening listening
        chrome.runtime.onMessage.removeListener(listener);

        console.log("m");
        setSummary(message.memory);
      }
    }

    // Recieve message from the content script to get the memory stats
    chrome.runtime.onMessage.addListener(listener);
  }

  // When the component gets first rendered, send message to the content script
  useEffect(sendMessage, []);

  // Extract summary from the memory summary that we get
  const currentAllocatedMemoryHeap = summary.currentAllocatedMemoryHeap;
  const memoryHeapSizeLimit = summary.memoryHeapSizeLimit;
  const totalMemoryHeapUsed = summary.totalMemoryHeapUsed;

  // Render the summary that we get
  return (
    <div className="summary">
      <div className="info-con">
        <div className="info">
          <strong>Memory Limit</strong>
          <span>{memoryHeapSizeLimit}</span>
        </div>
        <div className="info">
          <strong>Allocated Memory</strong>
          <span>{currentAllocatedMemoryHeap}</span>
        </div>
        <div className="info">
          <strong>Memory Used</strong>
          <span>{totalMemoryHeapUsed}</span>
        </div>
      </div>
    </div>
  );
}

export default Memory;
