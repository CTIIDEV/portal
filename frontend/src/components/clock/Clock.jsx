import { useEffect, useState } from "react";
import moment from "moment";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";

import "./clock.css";

export const Clock = () => {
  const [date, setDate] = useState(moment());

  useEffect(() => {
    var timer = setInterval(() => setTick(), 1000);
    return function clean() {
      clearInterval(timer);
    };
  });

  const setTick = () => {
    setDate(moment());
  };

  return (
    <div className="homeHeaderNav clock">
      <div className="clockLeft">
        <CalendarOutlined className="clockIcons" />{" "}
        {date.format("ddd, Do MMM YYYY")}
      </div>
      <div className="clockRight">
        <ClockCircleOutlined className="clockIcons" />{" "}
        {date.format("HH:mm:ss A")}
      </div>
    </div>
  );
};