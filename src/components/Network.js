/**
 * Component that renders the network call statistics by communicating with the content script.
 * As soon as the component renders, a fresh summary of the latest calls is generated.
 */

/*global chrome*/

import { useEffect } from "react";

const Network = ({ summary, sendMessage, stat, setter }) => {
  // Function to render a single network request as a table row
  const singleRequest = (request, idx) => {
    const requestedURL = request.shortURL;
    const timeTaken = request.timeTaken;
    const reqType = request.reqType;
    const ttfb = request.ttfb;

    return (
      <tr className="row" key={idx}>
        <td className="td url">{requestedURL}</td>
        <td className="num td">{timeTaken}</td>
        <td className="num td">{reqType}</td>
        <td className="num td last">{ttfb}</td>
      </tr>
    );
  };

  // When the component renders, send message to the content script
  useEffect(() => {
    sendMessage(stat, setter);
  }, []);

  // Render the network summary that we get
  return (
    <div className="summary tableContainer">
      <table className="table">
        <thead className="thead">
          <tr className="row">
            <th className="td th url">Requested URL</th>
            <th className="td th num">Time Taken</th>
            <th className="td th num">Request Type</th>
            <th className="td th num last">TTFB</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {/* Map on all the network requests and then render each network request as a table row */}
          {summary.map(function (request, idx) {
            return singleRequest(request, idx);
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Network;
