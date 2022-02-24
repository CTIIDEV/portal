import { useState, useEffect } from "react";
import { Area, Column } from "@ant-design/charts";

import "./chartsArea.css";

export const ChartsArea = ({ data }) => {
  console.log(data);
  var configArea = {
    data: data,
    xField: "year",
    yField: "value",
    seriesField: "name",
    color: ["#82d1de", "#cb302d", "#e3ca8c"],
    areaStyle: { fillOpacity: 0.7 },
    appendPadding: 10,
    isPercent: true,
  };

  var config = {
    data: data,
    isGroup: true,
    xField: "year",
    yField: "value",
    seriesField: "name",
    // label: {
    //   position: "middle",
    //   layout: [
    //     { type: "interval-adjust-position" },
    //     { type: "interval-hide-overlap" },
    //     { type: "adjust-color" },
    //   ],
    // },
  };

  return (
    <div className="chartsArea">
      <div className="componentContainer">
        <span className="componentTitle">Reveue Source (Area)</span>
      </div>
      <Area {...configArea} />
      <Column {...config} />
    </div>
  );
};
