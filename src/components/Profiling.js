// Component that allows the user to profile a website by communicating with the content script

/*global chrome*/
import { useState } from "react";

function Profiling() {
  // States for the input fields
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  // function that will be triggered on button click and send message to the content script to start profiling
  function handleSubmit(e) {
    e.preventDefault();

    // Time input that the user set
    const timing =
      e.target[1].value !== "" ? e.target[1].value : 15000;

    console.log(timing);

    // Data to be sent to the content script
    const data = {
      text: "profile",
      time: Number(timing),
      profileName: e.target[0].value,
    };

    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;

      //Sending the message to the content script to start profiling
      chrome.tabs.sendMessage(tabId, data);
    });

    // Reseting the input fields
    setName("");
    setTime("");
  }
  
  return (
    <div className="profileContainer">
      <form onSubmit={handleSubmit} className="formBox">
        <input
          placeholder="Enter profile name"
          className="inputField"
          value={name}
          onChange={function (e) {
            setName(e.target.value);
          }}
        ></input>

        <input
          placeholder="Enter the time interval for profiling in milliseconds (default is 15 seconds)"
          className="inputField"
          value={time}
          onChange={function (e) {
            setTime(e.target.value);
          }}
        ></input>

        <button className="profileButton btn" type="submit">
          Start Profiling
        </button>
      </form>
    </div>
  );
}

export default Profiling;
