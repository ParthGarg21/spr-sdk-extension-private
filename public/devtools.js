/*global chrome*/

// function to recieve a message from the bg script to download the HAR file
chrome.runtime.onMessage.addListener(function (message) {
  if (message === "get-har-bg") {
    // function to get the HAR file
    chrome.devtools.network.getHAR(function (har) {
      const updatedHarLog = {};
      updatedHarLog.log = har;

      //Downloading the HAR file
      const harBLOB = new Blob([JSON.stringify(updatedHarLog)]);

      const url = URL.createObjectURL(harBLOB);

      chrome.downloads.download({
        url: url,
        filename: Date.now() + "har",
      });
    });
  }
});
