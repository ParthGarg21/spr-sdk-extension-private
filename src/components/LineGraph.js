/**
 * Component that renders and builds the Line Graph
 * by fetching data from an API on regular intervals
 **/

import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function LineChart() {
  // Function to get the current time for X-axis label of the graph
  function getTime(isInitial) {
    // isInitial is a boolean value that prevents buggy rendering of the graph

    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let ampm = hours >= 12 ? "pm" : "am"; // AM or PM
    hours = hours % 12; // 12 hour format hour
    hours = hours ? hours : 12; // if hours is equal to 0, then we set the hours to 12
    minutes = minutes < 10 ? "0" + minutes : minutes; // get minute in 00 format, i.e., in two digits
    let sec = date.getSeconds();

    let strTime = hours + ":" + minutes + ampm;

    // In case seconds are not equal to 0, we set the answer string to be blank
    if (isInitial || sec !== 0) {
      strTime = "              ";
    }

    return strTime;
  }

  // Dummy data for the graph
  const yDummy = [];
  const xDummy = [];

  // Fill the dummy data inside the dummy arrays
  for (let i = 0; i < 240; i++) {
    xDummy.push(getTime(true));
    yDummy.push(undefined);
  }

  // States that will be used for the graph axes data for initial rendering of the graph
  const [xData, setXData] = useState([...xDummy]);
  const [yData, setYData] = useState([...yDummy]);

  // URL where the GET request using fetch will be made
  const url = "https://jsonplaceholder.typicode.com/posts";

  // Function to get a single entry for the graph by fetching data from the API, and then calculate its round trip duration
  function fillGraph() {
    // Main asynchronous function that calculates the round trip time.
    async function getRoundTripTime() {
      const res = await fetch(url);
      const data = await res.json();

      let dur;

      const req = window.performance.getEntriesByType("resource");

      // Search for the current request in the network request buffer to calculate its round trip time
      for (let i = req.length - 1; i >= 0; i--) {
        // If the request contains the url, this means this is the fetch request that was made
        // We get the round trip time for this request by taking the duration property

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

      // Update the states to include the fresh entries
      setXData([...xData]);
      setYData([...yData]);

      // If the request buffers gets completely filled, then we empty that buffer
      if (req.length === 245) {
        performance.clearResourceTimings();
      }
    }

    getRoundTripTime();
  }

  // Data options for the Graph
  const data = {
    // Map function to fill the X-axis data
    labels: xData.map(function (value) {
      return value;
    }),

    datasets: [
      {
        label: "Network Latency in milliseconds",

        // Map function to fill the Y-axis data
        data: yData.map(function (value) {
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

    // Option to disable rendering of the title of the graph
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        // X AXIS title
        title: {
          display: true,
          text: "Time",
        },

        // Maximum number of readings on the X AXIS
        max: 240,

        ticks: {
          number: 100,
          autoSkip: false,
        },

        // Disable X AXIS grid lines
        grid: {
          display: false,
        },
      },

      y: {
        // Y AXIS title
        title: {
          display: true,
          text: "Network Latency in milliseconds",
        },

        // Maximum and minimium number of readings on the Y AXIS
        min: 0,
        max: 600,

        ticks: {
          stepSize: 150,
        },
      },
    },
  };

  // Call fillGraph function to fill the data at regular intervals of 1 second
  function handleInterval() {
    const interval = setInterval(fillGraph, 1000);

    // To prevent the fetch request from executing twice
    return function stopTimer() {
      clearInterval(interval);
    };
  }

  // When the component renders, start filling the graph
  useEffect(handleInterval, []);

  return <Line data={data} options={options} />;
}

export default LineChart;
