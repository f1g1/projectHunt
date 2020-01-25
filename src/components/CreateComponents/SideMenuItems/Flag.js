import React from "react";
import FlagIcon from "@material-ui/icons/Flag";
import "./Flag.css";
function Flag(props) {
  return (
    <div className="sideMenuButtonContainer" onClick={props.handleClick}>
      <FlagIcon />
      <div className="sideMenuButtonText">Start Position</div>
    </div>
  );
}

export default Flag;
