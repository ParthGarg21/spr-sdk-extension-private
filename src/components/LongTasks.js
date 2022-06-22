/*global chrome*/

import { useState, useEffect } from "react";

function LongTasks() {
  function singleTask(task) {
    const name = task.name;
    const timeTaken = task.duration + "ms";

    return (
      <>
        <tr className="row">
          <td className="th td lt-td">{name}</td>
          <td className="th td last lt-td">{timeTaken}</td>
        </tr>
      </>
    );
  }

  const [summary, setSummary] = useState([]);

  function sendMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "longtasks");
    });

    // Function to listen to the incoming message containintg long task info
    function listener(message) {
      
      if (message.txt === "longtasks") {
        // removing the listener to avoid redundant listening
        chrome.runtime.onMessage.removeListener(listener);
        
        console.log("lt");
        setSummary(message.longtasks);
      }
    }

    // Sending the message to the get the long task requests
    chrome.runtime.onMessage.addListener(listener);
  }

  useEffect(sendMessage, []);

  return (
    <>
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
              return singleTask(task);
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LongTasks;
