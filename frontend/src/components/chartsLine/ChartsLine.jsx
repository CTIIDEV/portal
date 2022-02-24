import { useState, useEffect } from "react";
import { Line } from "@ant-design/charts";

import "./chartsLine.css";

export const ChartsLine = ({ data }) => {
  var config = {
    data: data,
    xField: "year",
    yField: "value",
    seriesField: "name",
  };

  return (
    <div className="chartsLine">
      <div className="componentContainer">
        <span className="componentTitle">Reveue Growth (Insurance Type)</span>
      </div>
      <Line {...config} />
    </div>
  );
};
