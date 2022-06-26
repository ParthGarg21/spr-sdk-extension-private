/*global chrome*/
const GetHar = () => {
  function downloadHar() {
    //Sending the message to the sdk to get the profiling data
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "har");
    });
  }

  return (
    <div className="getHarContainer">
      <h3 className="harHeading">
        Click to save all the network requests as .HAR file
      </h3>
      <button className="downloadButton btn" onClick={downloadHar}>
        Download
      </button>
    </div>
  );
};

export default GetHar;
