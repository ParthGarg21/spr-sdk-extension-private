/**
 * Component that renders and builds the Line Graph depicting CPU usage
 * by communicating with the content script on regular intervals
 **/

/*global chrome*/

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const CPU = () => {
  // Function to send a message to the sdk to get the cpu stats

  const getTime = (isInitial) => {
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
  };

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

  // Function to send message to the content script to get the cpu usage at a particular time
  const sendMessage = () => {
    // Send message to the content script by getting the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      //Send the message to the content script to get the cpu usage stats
      chrome.tabs.sendMessage(tabId, "cpu-app");
    });

    // Function to listen to the incoming message containing cpu usage info
    const listener = (message) => {
      // If we get the desired message from the content script, then update the cpu usage data
      if (message.text === "cpu") {
        // Remove listener to avoid unwanted redundant and repeated listening
        chrome.runtime.onMessage.removeListener(listener);
        const cpuUsage = Math.ceil(message.data);

        xData.shift();
        yData.shift();

        xData.push(getTime(false));
        yData.push(cpuUsage);

        // Set the states
        setXData([...xData]);
        setYData([...yData]);
      }
    };

    // Recieve message from the content script to get the cpu stats
    chrome.runtime.onMessage.addListener(listener);
  };

  // Data options for the Graph
  const data = {
    // Map function to fill the x-axis data
    labels: xData.map(function (value) {
      return value;
    }),

    datasets: [
      {
        label: "% CPU Usage",

        // Map function to fill the y-axis data
        data: yData.map(function (value) {
          return value;
        }),
        borderColor: "#13786b",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  // General config options for the graph
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
          text: "CPU Usage in %",
        },

        // Maximum and minimium number of readings on the Y AXIS
        min: 0,
        max: 100,

        ticks: {
          stepSize: 25,
        },
      },
    },
  };

  // Call sendMessage function to fill the data at regular intervals of 1 second
  const handleInterval = () => {
    const id = setInterval(sendMessage, 1000);

    // To prevent sendMessage to function twice
    return function stopTimer() {
      clearInterval(id);
    };
  };

  // When the component renders, start filling the graph
  useEffect(handleInterval, []);

  return <Line data={data} options={options} />;
};

export default CPU;
