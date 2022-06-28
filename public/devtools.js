// Devtools script
// Gets activated only when the developer tools are open

/*global chrome*/

// Function to receive a message from the bg script to download the HAR file
chrome.runtime.onMessage.addListener(function (message) {
  if (message === "get-har-bg") {
    // Function to get the HAR file
    chrome.devtools.network.getHAR(function (har) {
      const updatedHarLog = {};
      updatedHarLog.log = har;

      // Creating a BLOB object for the HAR file
      const harBLOB = new Blob([JSON.stringify(updatedHarLog)]);

      // Create an URL for the BLOB object
      const url = URL.createObjectURL(harBLOB);

      // Download using chrome.downloads API
      chrome.downloads.download({
        url: url,
        filename: Date.now() + "har",
        saveAs: true,
      });
    });
  }
});
