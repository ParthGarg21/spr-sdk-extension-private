// Attach the sdk to the window object in context of the console context of the extension
const sdk = new SprPerformanceMeasureSDK();

// previous data for the cpu usage
let prevUsed = 0;
let prevTotal = 0;

// Receive messages and deciding how to respond back
chrome.runtime.onMessage.addListener((message) => {
  if (message.text === "profile") {
    // If the message recieved is 'profile', then start profiling
    sdk.startProfiling(message.profileName, message.time);
  } else if (message === "cpu-app") {
    // send message to the background script to get the cpu-usage on recieving a message from the app
    getCPUStats();
  } else if (message.text === "cpu-bg") {
    // send messgae to the app after recieving the cpu usage data background script
    const currUsed = message.cpu.usageTime;
    const currTotal = message.cpu.totalTime;

    // The difference between usage time and total time
    const usedDiff = Math.abs(currUsed - prevUsed);
    const totalDiff = Math.abs(currTotal - prevTotal);

    // CPU usage
    const cpu = (usedDiff / totalDiff) * 100;

    prevTotal = currTotal;
    prevUsed = currUsed;

    const data = {
      text: "cpu",
      data: cpu,
    };

    // send the CPU usage to the App
    sendCPU(data);
  } else if (message === "network") {
    // If the message is to get the network stats, then send the network stats to the App
    sendNetworkStats();
  } else if (message === "memory") {
    // If the message is to get the memory stats, then send the memory stats to the App
    sendMemoryStats();
  } else if (message === "longtasks") {
    // If the message is to get the long tasks stats, then send the long task stats to the App
    sendLongTasks();
  } else if (message === "har") {
    // If the message is to download the HAR file, then send message to the background script to download the HAR
    sdk.getHAR();
  } else if (message === "print") {
    // If the message is to print the summary, then we simply print it
    sdk.printSummary();
  } else if (message === "copy") {
    // If the message is to copy the summary, then we send the summary to the App in JSON format
    sendSummaryAsJSON();
  } else if (message === "postMessage") {
    sdk.sendSummary();
  }
});

// Function to get the cpu stats
const getCPUStats = () => {
  // Sending a message to the background script to get the cpu stats
  chrome.runtime.sendMessage("cpu-sdk");
};

// Function to send the memory stats
const sendMemoryStats = () => {
  const memory = sdk.getMemoryStats();
  const data = {
    text: "memory",
    data: memory,
  };

  chrome.runtime.sendMessage(data);
};

// Function to send the network stats
const sendNetworkStats = () => {
  const network = sdk.getNetworkStats(0);
  const data = {
    text: "network",
    data: network,
  };

  chrome.runtime.sendMessage(data);
};

// Function to send the long tasks stats
const sendLongTasks = () => {
  const longtasks = sdk.getLongTasks();
  const data = {
    text: "longtasks",
    data: longtasks,
  };

  chrome.runtime.sendMessage(data);
};

// Function to send the cpu usage stats
const sendCPU = (data) => {
  chrome.runtime.sendMessage(data);
};

// Function to send the summary to the APP as JSON
const sendSummaryAsJSON = () => {
  const memorySummary = sdk.getMemoryStats();
  const networkSummary = sdk.getNetworkStats(0);
  const longTaskSummary = sdk.getLongTasks();

  const s1 = "Memory Summary: " + JSON.stringify(memorySummary) + "\n";
  const s2 = "Network Summary: " + JSON.stringify(networkSummary) + "\n";
  const s3 = "Long Tasks Summary: " + JSON.stringify(longTaskSummary) + "\n";

  const allSummary = s1 + s2 + s3;

  const data = {
    text: "copy",
    data: allSummary,
  };

  chrome.runtime.sendMessage(data);
};
