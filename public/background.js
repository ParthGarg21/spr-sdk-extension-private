// Background script

function cpuStats(tabID) {
  // Callback to get the cpu stats
  function getCpuStats(info) {
    // Get info about the different CPU processors
    const processors = info.processors;

    let totalTime = 0,
      usageTime = 0;

    for (let processor of processors) {
      totalTime += processor.usage.total;
      usageTime += processor.usage.kernel + processor.usage.user;
    }

    const cpu = {
      totalTime: totalTime,
      usageTime: usageTime,
    };

    const data = {
      text: "cpu-bg",
      cpu: cpu,
    };

    // Send message back to the content script with the CPU usage data
    chrome.tabs.sendMessage(tabID, data);
  }

  // Getting the cpu usage data
  chrome.system.cpu.getInfo(getCpuStats);
}

// Receive messages
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message === "cpu-sdk") {
    // If the message is to get the cpu stats, invoke the function to get the cpu stats
    cpuStats(sender.tab.id);
  } else if (message === "get-har") {
    // Send message to the devtools to get the network requests data as HAR file
    chrome.runtime.sendMessage("get-har-bg");
  }
});
