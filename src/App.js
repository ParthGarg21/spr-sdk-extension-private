import { VscGraphLine } from "react-icons/vsc";
import { TbNetwork } from "react-icons/tb";
import { GrMemory } from "react-icons/gr";
import { CgPerformance } from "react-icons/cg";
import { BsCpuFill } from "react-icons/bs";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";

import { useState } from "react";

import LineChart from "./components/LineGraph";

function App() {
  const [memory, setMemory] = useState(false);
  const [network, setNetwork] = useState(false);
  const [longTasks, setLongTasks] = useState(false);
  const [cpu, setCPU] = useState(false);

  function expandMem() {
    setMemory(!memory);
  }

  function expandNet() {
    setNetwork(!network);
  }

  function expandLongTask() {
    setLongTasks(!longTasks);
  }

  function expandCPU() {
    setCPU(!cpu);
  }

  return (
    <>
      <div className="wrapper">
        <div className="title-container">
          <img src="/logo.png" alt="" className="logo" />
          <h1 className="title">Sprinklr SDK Extension</h1>
        </div>
        <div className="main-container">
          <div className="features-con">
            <div className="feature">
              <div className="icn-con">
                <TbNetwork className="icn"></TbNetwork>
              </div>
              <h3 className="feature-title">Network calls statistics</h3>
              <div className="exp-icn-con">
                {!network ? (
                  <MdOutlineExpandMore
                    onClick={expandNet}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    onClick={expandNet}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>

            <div className="feature">
              <div className="icn-con">
                <GrMemory className="icn"></GrMemory>
              </div>
              <h3 className="feature-title">Memory statistics</h3>
              <div className="exp-icn-con">
                {!memory ? (
                  <MdOutlineExpandMore
                    onClick={expandMem}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    onClick={expandMem}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>

            <div className="feature">
              <div className="icn-con">
                <CgPerformance className="icn"></CgPerformance>
              </div>
              <h3 className="feature-title">Long tasks statistics</h3>
              <div className="exp-icn-con">
                {!longTasks ? (
                  <MdOutlineExpandMore
                    onClick={expandLongTask}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    onClick={expandLongTask}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>

            <div className="feature">
              <div className="icn-con">
                <BsCpuFill className="icn"></BsCpuFill>
              </div>
              <h3 className="feature-title">CPU usage</h3>
              <div className="exp-icn-con">
                {!cpu ? (
                  <MdOutlineExpandMore
                    onClick={expandCPU}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    onClick={expandCPU}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>

            <div className="feature">
              <div className="icn-con">
                <VscGraphLine className="icn"></VscGraphLine>
              </div>
              <h3 className="feature-title">Network latency graph</h3>
            </div>
          </div>
        </div>
        <div className="lineChart">
          <div className="chartContainer">
            <LineChart className="chart"></LineChart>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
