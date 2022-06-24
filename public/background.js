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

    const cpu = {
      totalTime: totalTime,
      usageTime: usageTime,
    };

    const data = {
      text: "cpu-bg",
      cpu: cpu,
    };

    // Sending message back to the content script with the CPU data
    chrome.tabs.sendMessage(tabID, data);
  }

  // Getting the cpu usage
  chrome.system.cpu.getInfo(getCpuStats);
}

// Recieving a message from the content script to get the CPU stats
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message === "cpu-sdk") {
    // Invoking the function to get the cpu stats
    cpuStats(sender.tab.id);
  } else if (message === "get-har") {
    // Sending the message to the devtools to get the har
    chrome.runtime.sendMessage("get-har-bg");
  }
  // } else if (message === "attach") {
  //   attach(sender.tab.id);
  // } else if (message === "profile") {
  //   profile(sender.tab.id);
  // }
});

// Attach the debugger to the current tab
// const isVis = new Set();

// function attach(tabId) {
//   if (isVis.has(tabId)) {
//     chrome.debugger.detach({ tabId, tabId }, function () {
//       chrome.debugger.attach({ tabId: tabId }, "1.3");
//     });
//   } else {
//     chrome.debugger.attach({ tabId: tabId }, "1.3");
//   }
//   isVis.add(tabId);
//   console.log("Attached to " + tabId);
// }

// function to do the CPU profiling

// function profile(tabId, time = 10000) {
//   const debuggee = { tabId: tabId };

//   chrome.debugger.sendCommand(debuggee, "Tracing.start", {}, function () {
//     console.log("Tracing Started");
//     setTimeout(function () {
//       chrome.debugger.sendCommand(debuggee, "Tracing.end", {}, function () {
//         console.log("Tracing Ended");
//         chrome.debugger.sendCommand(
//           debuggee,
//           "Tracing.tracingComplete",
//           { traceFormat, streamCompression },
//           function () {
//             console.log(traceFormat);
//           }
//         );
//       });
//     }, 10000);
//   });
// }
