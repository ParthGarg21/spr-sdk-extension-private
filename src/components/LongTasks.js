/**
 * Component that renders the long tasks statistics by communicating with the content script.
 * As soon as the component renders, a fresh summary of the latest calls is generated.
 */

/*global chrome*/

import { useState, useEffect } from "react";

const LongTasks = () => {
  // Function to render a single long task as a table row
  const singleTask = (task, id) => {
    const name = task.name;
    const timeTaken = task.duration + "ms";

    return (
      <tr className="row" key={id}>
        <td className="td lt-td">{name}</td>
        <td className="td last lt-td">{timeTaken}</td>
      </tr>
    );
  };

  // State to store the long tasks summary
  const [summary, setSummary] = useState([]);

  // Function to send a message to the content script to get the long tasks stats
  const sendMessage = () => {
    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "longtasks");
    });

    // Function to listen to the incoming message containing long task info
    const listener = (message) => {
      // If we get the desired message from the content script, then update the long tasks summary
      if (message.text === "longtasks") {
        // Remove listener to avoid unwanted redundant and repeated listening
        chrome.runtime.onMessage.removeListener(listener);
        setSummary(message.longtasks);
      }
    };

    // Recieve message from the content script to get the long tasks stats
    chrome.runtime.onMessage.addListener(listener);
  };

  // When the component renders, send message to the content script
  useEffect(sendMessage, []);

  return (
    <div className="summary">
      <table className="table">
        <thead className="thead">
          <tr className="row">
            <th className="td th lt-td">Name</th>
            <th className="td th last lt-td">Duration</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {summary.map(function (task, idx) {
            return singleTask(task, idx);
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LongTasks;
