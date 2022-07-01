// Content script

class SprPerformanceMeasureSDK {
  // Method to get network statistics which take time greater than 'duration' milliseconds to complete
  getNetworkStats(duration = 500) {
    // If browser does not support window.performance, then we can't extract the network requests
    if (
      window.performance === undefined ||
      window.performance.getEntriesByType === undefined
    ) {
      return "Network requests can't be extracted!";
    }
    // Function to clip the https or https header
    function clipHttps(url) {
      let count = 0;
      for (let i = 0; i < url.length; i++) {
        if (url[i] === "/") {
          count++;
        }
        if (count === 2) {
          return url.substring(i + 1);
        }
      }
    }

    // Function to shorten the url
    function shortenURL(url) {
      // Clip the http/https header
      url = clipHttps(url);

      // If the url is just a home route, return that route

      const home = window.location.host;

      // Clip url query parameters
      for (let i = url.length - 1; i >= 0; i--) {
        if (url[i] === "?") {
          url = url.substring(0, i);
          break;
        }
      }

      // If the url is a route from the current home page, then clip that portion
      if (url.includes(home) && url.length !== home.length + 1) {
        url = url.substring(home.length + 1);
      }

      // Clip the lastmost '/'
      if (url[url.length - 1] === "/") {
        url = url.substring(0, url.length - 1);
      }
      return url;
    }

    // Array to store required resources
    const extractedRequests = [];

    // Extract all the network requests
    // Gives an array of objects of network requests
    const allRequests = window.performance.getEntriesByType("resource");

    for (let i = 0; i < allRequests.length; i++) {
      // Current request
      const request = allRequests[i];

      const currDuration = request.duration;

      if (currDuration >= duration) {
        // Requested URL of the network request
        const requestedURL = request.name;

        // Time To First Byte (TTFB)
        const ttfb = request.responseStart - request.requestStart;

        // Initiator type
        const initiatorType = request.initiatorType;

        // Manually update the request type to API if the initiator is fetch
        // because by default, the entryType of each request is 'resource'.
        const reqType = initiatorType === "fetch" ? "API" : request.entryType; // request type

        // Store all request info into a request object
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

    // If the length of requested resources exceeds 245 then clear all the resources
    // as the network request buffer is limited in size
    if (allRequests.length >= 245) {
      performance.clearResourceTimings();
    }

    // Sort the network requests in decreasing order of duration
    extractedRequests.sort(function (a, b) {
      if (a.timeVal < b.timeVal) {
        return 1;
      } else if (a.timeVal === b.timeVal) {
        return 0;
      } else {
        return -1;
      }
    });

    return extractedRequests;
  }

  // Method to get the memory statistics
  getMemoryStats() {
    // If browser does not support window.performance, then we can't extract the memory requests
    if (
      window.performance === undefined ||
      window.performance.memory === undefined
    ) {
      return "Memory statistics can't be extracted!";
    }

    // Get memory statistics
    const memoryData = window.performance.memory;

    // Current allocated heap size including free and occupied space
    let currentAllocatedHeap = memoryData.totalJSHeapSize;

    // Used heap size
    let totalMemoryHeapUsed = memoryData.usedJSHeapSize;

    // Maximum heap size limit
    let heapSizeLimit = memoryData.jsHeapSizeLimit;

    // Convert Bytes to Megabytes
    currentAllocatedHeap = currentAllocatedHeap / (1024 * 1024);
    totalMemoryHeapUsed = totalMemoryHeapUsed / (1024 * 1024);
    heapSizeLimit = heapSizeLimit / (1024 * 1024);

    // Store memory info into memoryStats object
    const memoryStats = {
      currentAllocatedMemoryHeap: currentAllocatedHeap.toFixed(2) + "MB",
      totalMemoryHeapUsed: totalMemoryHeapUsed.toFixed(2) + "MB",
      memoryHeapSizeLimit: heapSizeLimit.toFixed(2) + "MB",
    };

    return memoryStats;
  }

  // Method to get all the long tasks
  getLongTasks() {
    let longTasks = []; // Array to store list of long tasks

    // Create a PerformanceObserver object
    const observer = new PerformanceObserver(function () {});

    // Register the observer to listen to longtask events
    // 'buffered' is set to true so that the all the long tasks can be reported starting from the first long task
    observer.observe({ type: "longtask", buffered: true });

    // Extract all the long tasks
    longTasks = observer.takeRecords();

    // Remove the event listener from the observer so that long tasks are no longer listened to
    observer.disconnect();

    // Sort the long tasks in decreasing order of duration
    longTasks.sort(function (a, b) {
      if (a.duration < b.duration) {
        return 1;
      } else if (a.duration === b.duration) {
        return 0;
      } else {
        return -1;
      }
    });

    return longTasks;
  }

  // Function to get summary of all statistics and print them on the console
  printSummary() {
    // Get the summary and store it into an object
    const finalSummary = {
      networkSummary: this.getNetworkStats(0),
      memorySummary: this.getMemoryStats(),
      longTaskSummary: this.getLongTasks(),
    };

    console.log("Summary: ", finalSummary);
  }

  // Method to start profile recording which takes 15 seconds as default
  startProfiling(profileName, timer = 15000) {
    // Start recording profile
    console.profile(profileName);

    // Stop recording the profile after 'timer' duration
    // This profile gets saved in the JavaScript Profiler panel in the Developer Tools
    setTimeout(function () {
      console.profileEnd(profileName);
    }, timer);
  }

  // Method to get the cpu stats
  getCPUStats() {
    // Sending a message to the background script to get the cpu stats
    chrome.runtime.sendMessage("cpu-sdk");
  }

  // Method to get the har data
  getHAR() {
    // Send message to the background script to download the HAR file
    chrome.runtime.sendMessage("get-har");
  }

  // Method to get summary of all statistics and post them to an API end-point
  sendSummary() {
    // get the summary
    const finalSummary = {
      networkSummary: this.getNetworkStats(0),
      memorySummary: this.getMemoryStats(),
      longTaskSummary: this.getLongTasks(),
    };

    // Function to send the data via fetch API
    async function postSummary() {
      // fetch options
      const options = {
        method: "POST",
        body: JSON.stringify(finalSummary),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      };

      const response = await fetch(
        "https://my-api-endpoint-largedata.vercel.app/api",
        options
      );
    }

    postSummary();
  }
}

// Attach the sdk to the window object in context of the console of the extension
const sdk = new SprPerformanceMeasureSDK();
window.sdk = sdk;

let prevUsed = 0;
let prevTotal = 0;

// Receive messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.text === "profile") {
    // If the message recieved is 'profile', then start profiling
    sdk.startProfiling(message.profileName, message.time);
  } else if (message === "cpu-app") {
    // send message to the background script to get the cpu-usage on recieving a message from the app
    sdk.getCPUStats();
  } else if (message.text === "cpu-bg") {
    // send messgae to the app on recieving after reccieving the cpu usage data background script
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
  } else if (message == "longtasks") {
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
