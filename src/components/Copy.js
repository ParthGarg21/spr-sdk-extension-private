// Module that renders the button to copy the summary to clipboard

/*global chrome*/

import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Copy = () => {
  const [summary, setSummary] = useState("");

  // Function to send a message to the content script to get the summary
  const sendMessage = () => {
    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "copy");
    });

    // Function to listen to the incoming message containing summary
    const listener = (message) => {
      // If we get the desired message from the content script, then update the summary
      if (message.text === "summary") {
        // removing the listener to avoid unwanted redundant and repeated listening listening
        chrome.runtime.onMessage.removeListener(listener);

        setSummary(message.summary);
      }
    };
    // Sending the message to the get the summary
    chrome.runtime.onMessage.addListener(listener);
  };

  // When the component gets first rendered, send message to the content script
  useEffect(sendMessage, []);

  return (
    <div className="copy-con">
      <h3 className="copy-heading">Click the button to copy the summary</h3>

      <CopyToClipboard text={summary}>
        <button className="btn copy-btn">Copy Summary</button>
      </CopyToClipboard>
    </div>
  );
};

export default Copy;
