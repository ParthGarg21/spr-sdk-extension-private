import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function LineChart() {
  function getTime(isInitial) {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let sec = date.getSeconds();
    let strTime = hours + ":" + minutes + ampm;

    if (isInitial || sec !== 0) {
      strTime = "              ";
    }

    return strTime;
  }

  const yDummy = [];
  const xDummy = [];

  // Filling the dummy data inside the dummy arrays
  for (let i = 0; i < 240; i++) {
    xDummy.push(getTime(true));
    yDummy.push(undefined);
  }

  // Setting up the states that will be used for the graph axes data
  const [xData, setXData] = useState([...xDummy]);
  const [yData, setYData] = useState([...yDummy]);

  const url = "https://jsonplaceholder.typicode.com/posts";

  // Function to get a single entry for the graph by fetching data from the API, and then calculating its round trip duration
  function fillGraph() {
    // Emptying the buffer once its max size is reached

    // Main asynchronous function that will calculate the round trip time.
    async function getRoundTripTime() {
      const res = await fetch(url);
      const data = await res.json();

      let dur;

      // Searching for the current request in the network request buffer to calculate its round trip time
      const req = window.performance.getEntriesByType("resource");

      if (req.length === 245) {
        performance.clearResourceTimings();
      }

      for (let i = req.length - 1; i >= 0; i--) {
        if (req[i].name.includes(url)) {
          dur = req[i].duration;
          break;
        }
      }
      // Modifying the states.
      xData.shift();
      yData.shift();

      xData.push(getTime(false));
      yData.push(dur);
      // Setting the states.
      setXData([...xData]);
      setYData([...yData]);
    }

    getRoundTripTime();
  }

  // Data options for the Graph
  const data = {
    // Using map function to fill the x-axis data
    labels: xData.map((value) => {
      return value;
    }),

    datasets: [
      {
        label: "Network Latency in milliseconds",

        // Using map function to fill the y-axis data
        data: yData.map((value) => {
          return value;
        }),
        borderColor: "#1a73e8",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  // General config options for the graph.
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    animation: {
      duration: 0,
    },

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },

        max: 240,

        ticks: {
          number: 100,
          autoSkip: false,
        },

        grid: {
          display: false,
        },
      },

      y: {
        title: {
          display: true,
          text: "Network Latency in milliseconds",
        },

        min: 0,
        max: 600,

        ticks: {
          stepSize: 150,
        },
      },
    },
  };

  // Making continuous calls to the fillGraph method to fill the data at regular intervals
  function handleInterval() {
    const interval = setInterval(fillGraph, 1000);

    // To prevent the fetch request from executing twice
    return function stopTimer() {
      clearInterval(interval);
    };
  }

  useEffect(handleInterval, []);

  return <Line data={data} options={options} />;
}

export default LineChart;

// Network Throttling Works only while the chrome dev tools is active
