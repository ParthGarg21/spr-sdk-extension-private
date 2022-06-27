// Module that renders the button to print the summary on the console

/*global chrome*/

function PrintSummary() {
  function sendMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "print");
    });
  }
  return (
    <div className="print-con">
      <h3 className="print-heading">
        Click the button to print summary on the console.
      </h3>
      <button className="btn print-btn" onClick={sendMessage}>
        Print Summary
      </button>
    </div>
  );
}

export default PrintSummary;
