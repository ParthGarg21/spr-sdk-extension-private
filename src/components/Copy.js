// Module that renders the button to copy the summary to clipboard

/*global chrome*/

import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function Copy() {
  const [summary, setSummary] = useState("");

  

  // When the component gets first rendered, send message to the content script
  useEffect(sendMessage, []);

  return (
    <div className="copy-con">
      <h3 className="copy-heading">Click the button to copy the summary</h3>

      <CopyToClipboard text={summary}>
        <button className="btn copy-btn">Copy Summary</button>
      </CopyToClipboard>
    </div>
  );
}

export default Copy;
