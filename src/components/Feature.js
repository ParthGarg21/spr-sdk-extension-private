/**
 * Component that renders a a particular feature amnd takes in logo, title and the component(feature) to
 * be rendered as props.
 */

import { useState } from "react";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";

const Feature = (props) => {
  // Setup state to expand and contract the feature
  const [expandFeature, setExpandFeature] = useState(false);

  // Function to expand and contract a feature
  const expand = () => {
    setExpandFeature(!expandFeature);
  };

  return (
    <>
      <div className="feature">
        <div className="icn-con">
          <props.icon className="icn"></props.icon>
        </div>
        <h3 className="feature-title">{props.title}</h3>
        <div className="exp-icn-con">
          {!expandFeature ? (
            <MdOutlineExpandMore
              className="exp-icn"
              onClick={expand}
            ></MdOutlineExpandMore>
          ) : (
            <MdOutlineExpandLess
              className="exp-icn"
              onClick={expand}
            ></MdOutlineExpandLess>
          )}
        </div>
      </div>
      {expandFeature ? <props.feature></props.feature> : <></>}
    </>
  );
};

export default Feature;
