/**
 * Component that renders the long tasks statistics by communicating with the content script.
 * As soon as the component renders, a fresh summary of the latest calls is generated.
 */

/*global chrome*/

import { useEffect } from "react";

const LongTasks = ({ summary, sendMessage, stat, setter }) => {
  // Function to render a single long task as a table row
  const singleTask = (task, id) => {
    const name = task.name;
    const timeTaken = task.duration;

    return (
      <tr className="row" key={id}>
        <td className="td lt-td">{name}</td>
        <td className="td last lt-td">{timeTaken}</td>
      </tr>
    );
  };

  // When the component renders, send message to the content script
  useEffect(() => {
    sendMessage(stat, setter);
  }, []);

  return (
    <div className="summary">
      <table className="table">
        <thead className="thead">
          <tr className="row">
            <th className="td th lt-td">Origin</th>
            <th className="td th last lt-td">Duration<br />(in ms)</th>
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
