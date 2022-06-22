/*global chrome*/

import { useState, useEffect } from "react";

function Network() {
  function summarizeURL(url) {
    let i = url.length - 1,
      j = url.length;
    while (i >= 0) {
      if (url[i] === "?") {
        j = i;
      } else if (url[i] === "/") {
        break;
      }
      i--;
    }

    return url.substring(i, j);
  }

  function singleRequest(request, idx) {
    const requestedURL = request.shortURL;
    const timeTaken = request.timeTaken;
    const reqType = request.reqType;
    const ttfb = request.ttfb;
    const initiatorType = request.initiatorType;
    const summarizedURL = summarizeURL(requestedURL);

    return (
      <tr className="row" key={idx}>
        <td className="td url">
          {initiatorType === "fetch" ? requestedURL : summarizedURL}
        </td>
        <td className="num td">{timeTaken}</td>
        <td className="num td">{reqType}</td>
        <td className="num td">{ttfb}</td>
        <td className="num td last">{initiatorType}</td>
      </tr>
    );
  }

  const [summary, setSummary] = useState([]);

  // function to send a message to the sdk to get the network stats
  function sendMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "network");
    });

    // Function to listen to the incoming message containint network info
    function listener(message) {
      if (message.txt === "network") {
        // removing the listener to avoid redunadt listening
        chrome.runtime.onMessage.removeListener(listener);
        
        console.log("n");
        setSummary(message.network);
      }
    }

    // Sending the message to the network stats
    chrome.runtime.onMessage.addListener(listener);
  }

  useEffect(sendMessage, []);

  return (
    <div className="summary tableContainer">
      <table className="table">
        <thead className="thead">
          <tr className="row">
            <th className="td th url">Requested URL</th>
            <th className="td th num">Time Taken</th>
            <th className="td th num">Request Type</th>
            <th className="td th num">TTFB</th>
            <th className="td th num last">Initiator Type</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {summary.map(function (request, idx) {
            return singleRequest(request, idx);
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Network;
