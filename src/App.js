import { VscGraphLine } from "react-icons/vsc";
import { TbNetwork } from "react-icons/tb";
import { GrMemory } from "react-icons/gr";
import { CgPerformance } from "react-icons/cg";
import { BsCpuFill } from "react-icons/bs";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";

import { useState } from "react";

import LineChart from "./components/LineGraph";
import Network from "./components/Network";
import Memory from "./components/Memory";
import LongTasks from "./components/LongTasks";
import CPU from "./components/CPU";

function App() {
  const [memory, setMemory] = useState(false);
  const [network, setNetwork] = useState(false);
  const [longTasks, setLongTasks] = useState(false);
  const [cpu, setCPU] = useState(false);
  const [networkGraph, setNetworkGraph] = useState(false);

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

  function expandNetworkGraph() {
    console.log(networkGraph);
    setNetworkGraph(!networkGraph);
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
                    className="exp-icn"
                    onClick={expandNet}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    className="exp-icn"
                    onClick={expandNet}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>
            {network ? <Network></Network> : <></>}

            <div className="feature">
              <div className="icn-con">
                <GrMemory className="icn"></GrMemory>
              </div>
              <h3 className="feature-title">Memory statistics</h3>
              <div className="exp-icn-con">
                {!memory ? (
                  <MdOutlineExpandMore
                    className="exp-icn"
                    onClick={expandMem}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    className="exp-icn"
                    onClick={expandMem}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>
            {memory ? <Memory></Memory> : <></>}

            <div className="feature">
              <div className="icn-con">
                <CgPerformance className="icn"></CgPerformance>
              </div>
              <h3 className="feature-title">Long tasks statistics</h3>
              <div className="exp-icn-con">
                {!longTasks ? (
                  <MdOutlineExpandMore
                    className="exp-icn"
                    onClick={expandLongTask}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    className="exp-icn"
                    onClick={expandLongTask}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>
            {longTasks ? <LongTasks></LongTasks> : <></>}
            <div className="feature">
              <div className="icn-con">
                <BsCpuFill className="icn"></BsCpuFill>
              </div>
              <h3 className="feature-title">CPU usage</h3>
              <div className="exp-icn-con">
                {!cpu ? (
                  <MdOutlineExpandMore
                    className="exp-icn"
                    onClick={expandCPU}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    className="exp-icn"
                    onClick={expandCPU}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>
            {cpu ? <CPU></CPU> : <></>}
            <div className="feature">
              <div className="icn-con">
                <VscGraphLine className="icn"></VscGraphLine>
              </div>
              <h3 className="feature-title">Network latency graph</h3>
              <div className="exp-icn-con">
                {!networkGraph ? (
                  <MdOutlineExpandMore
                    className="exp-icn"
                    onClick={expandNetworkGraph}
                  ></MdOutlineExpandMore>
                ) : (
                  <MdOutlineExpandLess
                    className="exp-icn"
                    onClick={expandNetworkGraph}
                  ></MdOutlineExpandLess>
                )}
              </div>
            </div>
          </div>
        </div>
        {networkGraph ? (
          <div className="lineChart">
            <div className="chartContainer">
              <LineChart className="chart"></LineChart>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default App;
