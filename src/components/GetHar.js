// Component that allows the user to download the network requests as HAR file
// by communicating with the content script

/*global chrome*/
const GetHar = () => {
  // Function that triggers on button click and communicates with the content script
  const downloadHar = () => {
    // Send message to the content script to download the HAR file
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, "har");
    });
  };

  return (
    <div className="getHarContainer">
      <h3 className="harHeading">
        Keep the developer tools open and then click download to save all the
        network requests as .HAR file
      </h3>
      <button className="downloadButton btn" onClick={downloadHar}>
        Download
      </button>
    </div>
  );
};

export default GetHar;
