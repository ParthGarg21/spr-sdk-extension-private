// Component that renders the main pop up of the extension

import { VscGraphLine } from "react-icons/vsc";
import { TbNetwork } from "react-icons/tb";
import { GrMemory } from "react-icons/gr";
import { CgPerformance } from "react-icons/cg";
import { BsCpuFill } from "react-icons/bs";
import { VscDebugContinue, VscOutput } from "react-icons/vsc";
import { TbWorldDownload } from "react-icons/tb";
import { MdContentCopy } from "react-icons/md";
import NetworkGraph from "./components/NetworkGraph";
import Network from "./components/Network";
import Memory from "./components/Memory";
import LongTasks from "./components/LongTasks";
import CPUGraph from "./components/cpuComponent/CPUGraph";
import Profiling from "./components/Profiling";
import GetHar from "./components/GetHar";
import Feature from "./components/Feature";
import PrintSummary from "./components/PrintSummary";
import Copy from "./components/Copy";

const App = () => {
  return (
    <div className="wrapper">
      <div className="title-container">
        <img src="/logo.png" alt="Sprinklr logo" className="logo" />
        <h1 className="title">Sprinklr SDK Extension</h1>
      </div>
      <div className="main-container">
        <div className="features-con">
          <Feature
            icon={TbNetwork}
            feature={Network}
            title="Network Calls Statistics"
          ></Feature>
          <Feature
            icon={GrMemory}
            feature={Memory}
            title="Memory Statistics"
          ></Feature>
          <Feature
            icon={CgPerformance}
            feature={LongTasks}
            title="Long Tasks Statistics"
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
          <Feature
            icon={MdContentCopy}
            feature={Copy}
            title="Copy summary to clipboard"
          ></Feature>
        </div>
      </div>
    </div>
  );
};

export default App;
