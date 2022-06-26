import { useState } from "react";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";

const ListItem = (props) => {
  const [myState, setMyState] = useState(false);

  function expand() {
    setMyState(!myState);
  }

  return (
    <div>
      {" "}
      <div className="feature">
        <div className="icn-con">
          <props.icon className="icn"></props.icon>
        </div>
        <h3 className="feature-title">{props.title}</h3>
        <div className="exp-icn-con">
          {!myState ? (
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
      {myState ? <props.display></props.display> : <></>}
    </div>
  );
};

export default ListItem;
