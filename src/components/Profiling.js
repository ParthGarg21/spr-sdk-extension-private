/*global chrome*/
import { useState } from "react";

function Profiling() {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const timing =
      e.target[1].value !== undefined ? e.target[1].value : "15000";
    console.log(timing);
    const message = {
      time: Number(timing),
      profileName: e.target[0].value,
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;

      //Sending the message to the sdk to get the profiling data
      chrome.tabs.sendMessage(tabId, message);
    });
    setName("");
    setTime("");
  }
  return (
    <div className="profileContainer">
      <form onSubmit={handleSubmit} className="formBox">
        <input
          name="profileName"
          placeholder="Enter profile name"
          className="inputField"
          value={name}
          onChange={function (e) {
            setName(e.target.value);
          }}
        ></input>
        <input
          name="timeField"
          placeholder="Enter the time interval for profiling in milliseconds"
          className="inputField"
          value={time}
          onChange={function (e) {
            setTime(e.target.value);
          }}
        ></input>
        <button className="profileButton" variant="dark" type="submit">
          Start Profiling
        </button>
      </form>
    </div>
  );
}

export default Profiling;
