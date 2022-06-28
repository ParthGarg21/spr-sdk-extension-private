// Component that allows the user to profile the performance of a website
// by communicating with the content script

/*global chrome*/
import { useState } from "react";

const Profiling = () => {
  // States for the input fields
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  // Function that triggers on button click and sends message to the content script to start profiling
  const handleSubmit = (e) => {
    e.preventDefault();

    // Time input that the user sets
    const timing = e.target[1].value !== "" ? e.target[1].value : 15000;

    console.log(timing);

    // Data passed to the content script
    const data = {
      text: "profile",
      time: Number(timing),
      profileName: e.target[0].value,
    };

    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      // Send message to the content script to start profiling
      chrome.tabs.sendMessage(tabId, data);
    });

    // Clear the input fields
    setName("");
    setTime("");
  };

  return (
    <div className="profileContainer">
      <form onSubmit={handleSubmit} className="formBox">
        <input
          placeholder="Enter profile name"
          className="inputField"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>

        <input
          placeholder="Enter the time interval for profiling in ms (default is 15 sec)"
          className="inputField"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
          }}
        ></input>

        <button className="profileButton btn" type="submit">
          Start Profiling
        </button>
      </form>
    </div>
  );
};

export default Profiling;
