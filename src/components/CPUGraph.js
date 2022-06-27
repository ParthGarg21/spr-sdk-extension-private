// Component that renders a graph containing CPU usage statistics

import CPU from "./CPU";

function CPUGraph() {
  return (
    <div className="lineChart">
      <div className="chartContainer">
        <CPU></CPU>
      </div>
    </div>
  );
}

export default CPUGraph;
