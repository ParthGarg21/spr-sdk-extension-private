// Content script

/*global chrome*/

class SprPerformanceMeasureSDK {
  // Method to get network statistics which take time greater than 'duration' milliseconds to complete
  getNetworkStats(duration = 500) {
    // console.log(str);
    // If browser does not support window.performance, then we can't extract the network requests
    if (
      window.performance === undefined ||
      window.performance.getEntriesByType === undefined
    ) {
      return "Network requests can't be extracted!";
    }

    // Extract all the network requests
    // Gives an array of objects of network requests
    const allRequests = window.performance.getEntriesByType("resource");

    const extractedRequests = allRequests.reduce((prev, request) => {
      const currDuration = request.duration;

      if (currDuration >= duration) {
        // Store all request info into a request object
        const req = {
          // Requested URL of the network request
          requestedURL: request.name,
          timeTaken: Number(currDuration.toFixed(2)),
          entryType: request.entryType,
          // Time To First Byte (TTFB)
          ttfb: Number((request.responseStart - request.requestStart).toFixed(2)),
          // Shortened URL
          shortURL: shortenURL(request.name, window.location.host),
          initiatorType: request.initiatorType,
          domainLookupStart: Number(request.domainLookupStart).toFixed(2),
          domainLookupEnd: Number(request.domainLookupEnd).toFixed(2),
        };

        return [...prev, req];
      }

      return prev;
    }, []);

    // If the length of requested resources exceeds 245 then clear all the resources
    // as the network request buffer is limited in size
    if (allRequests.length >= 245) {
      performance.clearResourceTimings();
    }

    // Sort the network requests in decreasing order of duration
    sortArray(extractedRequests, "timeTaken");

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

    // Store memory info into an object and return it
    return {
      currentAllocatedMemoryHeap: currentAllocatedHeap.toFixed(2) + "MB",
      totalMemoryHeapUsed: totalMemoryHeapUsed.toFixed(2) + "MB",
      memoryHeapSizeLimit: heapSizeLimit.toFixed(2) + "MB",
    };
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
    sortArray(longTasks, "duration");

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

  // Method to get the har data
  getHAR() {
    // Send message to the devtools script to download the HAR file
    chrome.runtime.sendMessage("get-har");
  }

  // Method to get summary of all statistics and post them to an API end-point
  async sendSummary() {
    const postURL = "https://my-api-endpoint-largedata.vercel.app/api";
    // get the summary
    const finalSummary = {
      networkSummary: this.getNetworkStats(0),
      memorySummary: this.getMemoryStats(),
      longTaskSummary: this.getLongTasks(),
    };

    const options = {
      method: "POST",
      body: JSON.stringify(finalSummary),
      headers: {
        // Specifying explicitilly that the content is in JSON string format
        "Content-Type": "application/json",
      },
      mode: "no-cors",
    };

    await fetch(postURL, options);
  }

  // Method to start profile recording which takes 15 seconds as default
  startProfiling(profileName, timer = 15000) {
    // Start recording profile
    console.profile(profileName);

    // Stop recording the profile after 'timer' duration
    // This profile gets saved in the JavaScript Profiler panel in the Developer Tools
    setTimeout(() => {
      console.profileEnd(profileName);
    }, timer);
  }

  // method to stop the most recent profile manually
  stopProfiling() {
    console.profileEnd();
  }
}
