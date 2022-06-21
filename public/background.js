function cpuStats(tabID = -1) {
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

    const used = (usageTime / totalTime) * 100;

    if (tabID !== -1) {
      const data = {
        text: "cpu",
        totalTime: totalTime,
        usageTime: usageTime,
        utilization: used,
      };

      // Sending message back to the content script with the CPU data
      chrome.tabs.sendMessage(tabID, data);
    } else {
      // Sending the message to the CPU.js component
      const cpu = {
        totalTime: totalTime,
        usageTime: usageTime,
        utilization: used,
      };
      const data = {
        text: "cpu",
        cpu: cpu,
      };
      chrome.runtime.sendMessage(data);
    }
  }

  // Getting the cpu usage
  chrome.system.cpu.getInfo(getCpuStats);
}

function profile(tabId) {
  chrome.debugger.sendCommand(
    { tabId: tabId },
    "Debugger.enable",
    {},
    function () {
      chrome.debugger.sendCommand(
        { tabId: tabId },
        "Profiler.enable",
        {},
        function () {
          chrome.debugger.sendCommand(
            { tabId: tabId },
            "Profiler.start",
            {},
            function () {
              setTimeout(function () {
                chrome.debugger.sendCommand(
                  { tabId: tabId },
                  "Profiler.stop",
                  {},
                  function (res) {
                    console.log(res);
                  }

                  // Download logic --> url is a barrier
                );
              }, 10000);
            }
          );
        }
      );
    }
  );
}

function snapshot(tabId) {
  chrome.debugger.sendCommand(
    { tabId: tabId },
    "HeapProfiler.takeHeapSnapshot",
    {},
    function (res) {
      console.log("Snapshot Taken");
      console.log(res);
    }
  );
}

const isVis = new Set();

function attach(tabId) {
  if (isVis.has(tabId)) {
    chrome.debugger.detach({ tabId: tabId }, function () {
      chrome.debugger.attach({ tabId: tabId }, "1.3", function () {
        console.log(`attached on ${tabId}`);
      });
    });
  } else {
    chrome.debugger.attach({ tabId: tabId }, "1.3", function () {
      console.log(`attached on ${tabId}`);
    });
  }

  isVis.add(tabId);
}

// Recieving a message from the content script to get the CPU stats
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message === "cpu") {
    // Invoking the function to get the cpu stats
    cpuStats(sender.tab.id);
  } else if (message === "attach") {
    attach(sender.tab.id);
  } else if (message === "snapshot") {
    snapshot(sender.tab.id);
  } else if (message === "profile") {
    profile(sender.tab.id);
  } else if (message === "cpu-app") {
    console.log("cpu req");
    cpuStats();
  }
});
