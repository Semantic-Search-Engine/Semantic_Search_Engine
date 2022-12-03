import React from "react";
// import qlogo from "../load.webp";
import load from "../loading.gif";

function LoadingState() {
  return <div>
    {/* <img className="foresight-logo logo-yapa-mwamba" alt="Qsearch" src={qlogo} /> */}
    <img className="foresight-logo" alt="Qsearch" src={load} />
  
  </div>;
}

export default LoadingState;
