import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import jwt from "jwt-decode";
import { Button, Layout, message } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ExportOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../context/UserContext";

import "./layoutHeader.css";

export const LayoutHeader = () => {
  const [user, setUser] = useContext(UserContext);
  const [date, setDate] = useState(moment());
  const { Header } = Layout;

  const refreshToken = async () => {
    try {
      const result = await axios.post(
        "http://localhost:5050/api/v1/user/refresh",
        { token: user.refreshToken }
      );
      setUser({
        ...user,
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      });
      return result.data;
    } catch (error) {
      message.error(error.response.data);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    var timer = setInterval(() => setTick(), 1000);
    return function clean() {
      clearInterval(timer);
    };
  });

  const setTick = () => {
    setDate(moment());
  };

  const handleLogout = async () => {
    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/user/logout",
        { token: user.refreshToken },
        { headers: { authorization: "Bearer " + user.accessToken } }
      )
      .then(() => {
        setUser("");
        localStorage.clear();
      })
      .catch((error) => {
        // console.log(error.response);
        message.error(error.response.data);
      });
  };

  return (
    <Header className="layout-header">
      <div className="layout-header__left">
        <div className="layout-header__left-display">
          <CalendarOutlined className="left-display__icon" />
          {date.format("ddd, Do MMM YYYY")}
        </div>
      </div>
      <div className="layout-header__center">
        <div className="layout-header__center-display">
          <ClockCircleOutlined className="center-display__icon" />
          {date.format("HH:mm:ss A")}
        </div>
      </div>
      <div className="layout-header__right">
        <div className="layout-header__right-display">
          <Button
            className="right-display__button-logout"
            type="primary"
            size="middle"
            icon={<ExportOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </Header>
  );
};
