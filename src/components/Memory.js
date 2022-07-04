/**
 * Component that renders the memory statistics by communicating with the content script.
 * As soon as the component renders, a fresh summary of the latest calls is generated.
 */

/*global chrome*/

import { useEffect } from "react";

const Memory = ({summary, sendMessage, stat, setter}) => {

  // When the component renders, send message to the content script
  useEffect(() => {
    sendMessage(stat, setter);
  }, []);

  // Extract the required information from the memory summary that we get
  const currentAllocatedMemoryHeap = summary.currentAllocatedMemoryHeap;
  const memoryHeapSizeLimit = summary.memoryHeapSizeLimit;
  const totalMemoryHeapUsed = summary.totalMemoryHeapUsed;

  // Render the summary that we get
  return (
    <div className="summary">
      <div className="info-con">
        <div className="info">
          <strong>Memory Limit</strong>
          <span>{memoryHeapSizeLimit}</span>
        </div>
        <div className="info">
          <strong>Allocated Memory</strong>
          <span>{currentAllocatedMemoryHeap}</span>
        </div>
        <div className="info">
          <strong>Memory Used</strong>
          <span>{totalMemoryHeapUsed}</span>
        </div>
      </div>
    </div>
  );
};

export default Memory;
