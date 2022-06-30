// Component that renders the main pop up of the extension

/*global chrome*/

import { VscGraphLine } from "react-icons/vsc";
import { TbNetwork } from "react-icons/tb";
import { GrMemory } from "react-icons/gr";
import { CgPerformance } from "react-icons/cg";
import { BsCpuFill } from "react-icons/bs";
import { VscDebugContinue, VscOutput } from "react-icons/vsc";
import { TbWorldDownload } from "react-icons/tb";
import { MdContentCopy } from "react-icons/md";
import NetworkGraph from "./components/networkGraphComponent/NetworkGraph";
import Network from "./components/Network";
import Memory from "./components/Memory";
import LongTasks from "./components/LongTasks";
import CPUGraph from "./components/cpuComponent/CPUGraph";
import Profiling from "./components/Profiling";
import GetHar from "./components/GetHar";
import Feature from "./components/Feature";
import PrintSummary from "./components/PrintSummary";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiShare } from "react-icons/fi";
import { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";

const App = () => {
  // State to store the text to be copied
  const [copy, setCopy] = useState("");

  // State to store the text to be copied
  const [memory, setMemory] = useState({});

  // State to store the text to be copied
  const [network, setNetwork] = useState([]);

  // State to store the text to be copied
  const [longTasks, setLongTasks] = useState([]);

  // Function to post message to an api end point
  const shareMessage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "postMessage");
    });
  };

  // Function to send a message to the content script to get a particular type of summary
  const sendMessage = (stat, setter) => {
    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, stat);
    });

    // Function to listen to the incoming message containing the dessired info
    const listener = (message) => {
      // If we get the desired message from the content script, then we update the desired state
      if (message.text === stat) {
        // Remove listener to avoid unwanted redundant and repeated listening
        chrome.runtime.onMessage.removeListener(listener);
        setter(message.data);
      }
    };

    // Recieve message from the content script to get the desired stats
    chrome.runtime.onMessage.addListener(listener);
  };

  // Function to refresh all the stats
  const refresh = () => {
    sendMessage("network", setNetwork);
    sendMessage("memory", setMemory);
    sendMessage("longtasks", setLongTasks);
  };

  // Initially setting up the copy text when the extension renders
  useEffect(function () {
    sendMessage("copy", setCopy);
  }, []);

  return (
    <div className="wrapper">
      <div className="title-container">
        
        <div className="logo-con">
          <img src="/logo.png" alt="Sprinklr logo" className="logo" />
          <h1 className="title">Sprinklr SDK Extension</h1>
        </div>
        
        <div className="menu-icns">
          <MdOutlineRefresh className="menu-icn" onClick={refresh}></MdOutlineRefresh>

          <FiShare className="menu-icn" onClick={shareMessage}></FiShare>

          <CopyToClipboard text={copy}>
            <MdContentCopy
              onClick={() => {
                sendMessage("copy", setCopy);
              }}
              className="menu-icn"
            ></MdContentCopy>
          </CopyToClipboard>
        </div>

      </div>
      <div className="main-container">
        <div className="features-con">
          <Feature
            icon={TbNetwork}
            feature={Network}
            title="Network Calls Statistics"
            sendMessage={sendMessage}
            summary={network}
            setter={setNetwork}
            stat={"network"}
          ></Feature>
          <Feature
            icon={GrMemory}
            feature={Memory}
            title="Memory Statistics"
            sendMessage={sendMessage}
            summary={memory}
            setter={setMemory}
            stat={"memory"}
          ></Feature>

          <Feature
            icon={CgPerformance}
            feature={LongTasks}
            title="Long Tasks Statistics"
            sendMessage={sendMessage}
            summary={longTasks}
            setter={setLongTasks}
            stat={"longtasks"}
          ></Feature>
          <Feature
            icon={BsCpuFill}
            feature={CPUGraph}
            title="CPU Usage"
          ></Feature>
          <Feature
            icon={VscGraphLine}
            feature={NetworkGraph}
            title="Network Latency Graph"
          ></Feature>
          <Feature
            icon={VscDebugContinue}
            feature={Profiling}
            title="Profiling"
          ></Feature>
          <Feature
            icon={TbWorldDownload}
            feature={GetHar}
            title="Save Network Requests as .HAR"
          ></Feature>
          <Feature
            icon={VscOutput}
            feature={PrintSummary}
            title="Print Summary on the console"
          ></Feature>
        </div>
      </div>
    </div>
  );
};

export default App;
