/**
 * Component that renders the long tasks statistics by communicating with the content script.
 * Whenever the component is rendered, the fresh summary is generated.
 */

/*global chrome*/

import { useState, useEffect } from "react";

function LongTasks() {
  // Function to render a single long task as a table row
  function singleTask(task, id) {
    const name = task.name;
    const timeTaken = task.duration + "ms";

    return (
      <tr className="row" key={id}>
        <td className="td lt-td">{name}</td>
        <td className="td last lt-td">{timeTaken}</td>
      </tr>
    );
  }

  // State to store the network summary
  const [summary, setSummary] = useState([]);

  // Function to send a message to the content script to get the long tasks stats
  function sendMessage() {
    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "longtasks");
    });

    // Function to listen to the incoming message containintg long task info
    function listener(message) {
      // If we get the desired message from the content script, then update the memory summay
      if (message.text === "longtasks") {
        // removing the listener to avoid unwanted redundant and repeated listening listening
        chrome.runtime.onMessage.removeListener(listener);

        console.log("lt");
        setSummary(message.longtasks);
      }
    }

    // Sending the message to the get the long task requests
    chrome.runtime.onMessage.addListener(listener);
  }

  // When the component gets first rendered, send message to the content script
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
}

export default LongTasks;
