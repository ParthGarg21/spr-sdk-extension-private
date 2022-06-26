import { VscGraphLine } from "react-icons/vsc";
import { TbNetwork } from "react-icons/tb";
import { GrMemory } from "react-icons/gr";
import { CgPerformance } from "react-icons/cg";
import { BsCpuFill } from "react-icons/bs";
import { VscDebugContinue } from "react-icons/vsc";
import { TbWorldDownload } from "react-icons/tb";
import NetworkGraph from "./components/NetworkGraph";
import Network from "./components/Network";
import Memory from "./components/Memory";
import LongTasks from "./components/LongTasks";
import CPUGraph from "./components/CPUGraph";
import Profiling from "./components/Profiling";
import GetHar from "./components/GetHar";
import ListItem from "./components/ListItem";

function App() {
  return (
    <>
      <div className="wrapper">
        <div className="title-container">
          <img src="/logo.png" alt="" className="logo" />
          <h1 className="title">Sprinklr SDK Extension</h1>
        </div>
        <div className="main-container">
          <div className="features-con">
            <ListItem
              icon={TbNetwork}
              display={Network}
              title="Network Call Statistics"
            ></ListItem>
            <ListItem
              icon={GrMemory}
              display={Memory}
              title="Memory Statistics"
            ></ListItem>
            <ListItem
              icon={CgPerformance}
              display={LongTasks}
              title="Long Tasks Statistics"
            ></ListItem>
            <ListItem
              icon={BsCpuFill}
              display={CPUGraph}
              title="CPU Usage"
            ></ListItem>
            <ListItem
              icon={VscGraphLine}
              display={NetworkGraph}
              title="Network Latency Graph"
            ></ListItem>
            <ListItem
              icon={VscDebugContinue}
              display={Profiling}
              title="Profiling"
            ></ListItem>
            <ListItem
              icon={TbWorldDownload}
              display={GetHar}
              title="Save Network Requests as .HAR"
            ></ListItem>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
