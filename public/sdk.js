/*global chrome*/
class SprPerformanceMeasureSDK {
  constructor(callback = undefined) {
    if (callback === undefined) {
      return;
    }

    const controls = callback();
    this.displayGraph = controls.displayGraph;
    this.closeGraph = controls.closeGraph;
    this.displayPopup = controls.displayPopup;
    this.closeSummary = controls.closeSummary;

    // function to get summary of all statistics and then send them to the popup by updating the states
    this.displaySummary = function () {
      const networkSummary = this.getNetworkStats(0);
      const memorySummary = this.getMemoryStats();
      const longTaskSummary = this.getLongTasks();

      this.displayPopup(memorySummary, networkSummary, longTaskSummary);
    };
  }

  // get network statistics
  getNetworkStats(duration = 500) {
    // if browser does not support window.performance
    if (
      window.performance === undefined ||
      window.performance.getEntriesByType === undefined
    ) {
      return "Network requests can't be extracted!";
    }

    function shortenURL(url) {
      let count = 0;
      for (let i = 0; i < url.length; i++) {
        if (url[i] == "/") {
          count++;
        }

        if (count === 3) {
          return url.substring(i);
        }
      }
    }
    // array to store required resources
    const extractedRequests = [];

    const allRequests = window.performance.getEntriesByType("resource");

    for (let i = 0; i < allRequests.length; i++) {
      const request = allRequests[i];

      const currDuration = request.duration;
      if (currDuration >= duration) {
        const requestedURL = request.name; // url
        const ttfb = request.responseStart - request.requestStart; // time to first byte
        const initiatorType = request.initiatorType;

        // manually updating the request type to API if the initiator is fetch
        const reqType = initiatorType === "fetch" ? "API" : request.entryType; // request type

        // storing all request info into a request object
        const req = {
          requestedURL: requestedURL,
          timeTaken: currDuration.toFixed(2) + "ms",
          reqType: reqType,
          ttfb: ttfb.toFixed(2) + "ms",
          timeVal: Number(currDuration.toFixed(2)),
          shortURL: shortenURL(requestedURL),
          initiatorType: initiatorType,
        };

        extractedRequests.push(req);
      }
    }

    // if the length of requested resources exceeds 240 then clear all the resources
    if (allRequests.length >= 240) {
      performance.clearResourceTimings();
    }

    // Sorting the network requests in increasing order on the basis of duration.

    extractedRequests.sort(function (a, b) {
      if (a.timeVal < b.timeVal) {
        return 1;
      }
      return -1;
    });

    return extractedRequests;
  }

  // get memory statistics
  getMemoryStats() {
    const memoryData = performance.memory;

    let currentAllocatedHeap = memoryData.totalJSHeapSize; // current heap size
    let totalMemoryHeapUsed = memoryData.usedJSHeapSize; // used heap size
    let heapSizeLimit = memoryData.jsHeapSizeLimit; // maximum heap size limit

    // converting Bytes to Megabytes
    currentAllocatedHeap = currentAllocatedHeap / (1024 * 1024);
    totalMemoryHeapUsed = totalMemoryHeapUsed / (1024 * 1024);
    heapSizeLimit = heapSizeLimit / (1024 * 1024);

    // storing memory info into memoryStats object
    const memoryStats = {
      currentAllocatedMemoryHeap: currentAllocatedHeap.toFixed(2) + "MB",
      totalMemoryHeapUsed: totalMemoryHeapUsed.toFixed(2) + "MB",
      memoryHeapSizeLimit: heapSizeLimit.toFixed(2) + "MB",
    };
    return memoryStats;
  }

  // get long tasks statistics
  getLongTasks() {
    let longTasks = []; // array to store list of long tasks
    const observer = new PerformanceObserver(function () {});

    observer.observe({ type: "longtask", buffered: true });

    longTasks = observer.takeRecords();

    // This method removes the event listener from the observer
    observer.disconnect();

    // Sorting the long tasks in increasing order on the basis of duration.
    longTasks.sort(function (a, b) {
      if (a.duration < b.duration) {
        return 1;
      }

      return -1;
    });

    return longTasks;
  }

  // function to get summary of all statistics and print them on the console
  printSummary() {
    const finalSummary = {
      networkSummary: this.getNetworkStats(0),
      memorySummary: this.getMemoryStats(),
      longTaskSummary: this.getLongTasks(),
    };

    console.log("Summary: ", finalSummary);
  }

  // function to start profile recording
  startProfiling(profileName, timer = 15000) {
    console.profile(profileName);
    setTimeout(() => {
      console.profileEnd(profileName);
    }, timer);
  }

  // Method to get the cpu stats
  getCPUStats() {
    //Sending a message to the background script to get the cpu stats
    chrome.runtime.sendMessage("cpu-sdk");
  }
}

const sdk = new SprPerformanceMeasureSDK();
window.sdk = sdk;

let prevUsed = 0;
let prevTotal = 0;

// Recieving a message
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // reset the previous values
  if (message.time !== undefined) {
    console.log(message);
    sdk.startProfiling(message.profileName, message.time);
  } else if (message === "cpu-app") {
    // send message to the bg script on recieving a message from the app
    sdk.getCPUStats();
  } else if (message.text === "cpu-bg") {
    // send messgae to the app on recieving a message from the bg script
    const currUsed = message.cpu.usageTime;
    const currTotal = message.cpu.totalTime;

    const usedDiff = Math.abs(currUsed - prevUsed);
    const totalDiff = Math.abs(currTotal - prevTotal);

    const cpu = (usedDiff / totalDiff) * 100;

    prevTotal = currTotal;
    prevUsed = currUsed;

    const data = {
      text: "cpu",
      cpu: cpu,
    };

    sendCPU(data);
  } else if (message === "network") {
    console.log("got network req");
    sendNetworkStats();
  } else if (message === "memory") {
    console.log("got memory req");
    sendMemoryStats();
  } else if (message == "longtasks") {
    console.log("got long task req");
    sendLongTasks();
  }
});

// Function to send the network stats
function sendMemoryStats() {
  const memory = sdk.getMemoryStats();
  const data = {
    txt: "memory",
    memory: memory,
  };

  chrome.runtime.sendMessage(data);
}

// Function to send the network stats
function sendNetworkStats() {
  const network = sdk.getNetworkStats(0);
  const data = {
    txt: "network",
    network: network,
  };

  chrome.runtime.sendMessage(data);
}

// Function to send the long tasks stats
function sendLongTasks() {
  const longtasks = sdk.getLongTasks();
  const data = {
    txt: "longtasks",
    longtasks: longtasks,
  };

  chrome.runtime.sendMessage(data);
}

// Function to send the cpu stats back

function sendCPU(data) {
  chrome.runtime.sendMessage(data);
}
