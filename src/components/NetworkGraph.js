// Component that renders the network latency graph

import LineChart from "./LineGraph";

const NetworkGraph = () => {
  return (
    <div className="lineChart">
      <div className="networkContainer">
        <LineChart className="chart"></LineChart>
      </div>
    </div>
  );
};

export default NetworkGraph;
