function cpuStats(tabID) {
  // Callback to get the cpu stats

  function getCpuStats(info) {
    // Getting info about the different CPU processors
    const processors = info.processors;

    let totalTime = 0,
      usageTime = 0;

    for (let processor of processors) {
      totalTime += processor.usage.total;
      usageTime += processor.usage.kernel + processor.usage.user;
    }

    const used = (usageTime / totalTime)  * 100;

    const data = {
      text: "CPU",
      totalTime: totalTime,
      usageTime: usageTime,
      cpuUsage: used,
    };

    // Sending message back to the content script with the CPU data
    chrome.tabs.sendMessage(tabID, data);
  }

  // Getting the cpu usage
  chrome.system.cpu.getInfo(getCpuStats);
}

// Recieving a message from the content script to get the CPU stats
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message === "get cpu stats") {
    // Invoking the function to get the cpu stats
    cpuStats(sender.tab.id);
  }
});
