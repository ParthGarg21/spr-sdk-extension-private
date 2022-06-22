/*global chrome*/

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function CPU() {
  // function to send a message to the sdk to get the cpu stats

  function getTime() {
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let sec = date.getSeconds();
    let strTime = hours + ":" + minutes + ampm;

    if (sec !== 0) {
      strTime = "              ";
    }
    return strTime;
  }

  // Dummy data for the graph
  const yDummy = [];
  const xDummy = [];

  // Filling the dummy data inside the dummy arrays
  for (let i = 0; i < 240; i++) {
    xDummy.push(getTime());
    yDummy.push(undefined);
  }

  // Setting up the states that will be used for the graph axes data
  const [xData, setXData] = useState([...xDummy]);
  const [yData, setYData] = useState([...yDummy]);

  function sendMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;

      //Sending the message to the sdk to get the cpu stats
      chrome.tabs.sendMessage(tabId, "cpu-app");
    });

    // Function to listen to the incoming message containint network info
    function listener(message) {
      if (message.text === "cpu") {
        // Removing the listener
        chrome.runtime.onMessage.removeListener(listener);
        const cpuUsage =
          (message.cpu === undefined ? 0 : Math.trunc(Math.ceil(message.cpu)));

        xData.shift();
        yData.shift();

        xData.push(getTime());
        yData.push(cpuUsage);

        // Setting the states.
        setXData([...xData]);
        setYData([...yData]);
      }
    }

    chrome.runtime.onMessage.addListener(listener);
  }

  function handleInterval() {
    const id = setInterval(sendMessage, 1000);

    return function close() {
      clearInterval(id);
    };
  }
  useEffect(handleInterval, []);

  const data = {
    // Using map function to fill the x-axis data
    labels: xData.map(function (value) {
      return value;
    }),

    datasets: [
      {
        label: "% CPU Usage",

        // Using map function to fill the y-axis data
        data: yData.map(function (value) {
          return value;
        }),
        borderColor: "#13786b",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

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
          autoSkip: false,
        },

        grid: {
          display: false,
        },
      },

      y: {
        title: {
          display: true,
          text: "CPU Usage in %",
        },

        min: 0,
        max: 100,

        ticks: {
          stepSize: 25,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default CPU;
