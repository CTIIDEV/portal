import { useContext } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Link, useHistory } from "react-router-dom";
import { Button } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { UserContext } from "../../context/UserContext";

import "./actions.css";

export const Actions = () => {
  const [user, setUser, accessToken, setAccessToken] = useContext(UserContext);

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5050/api/v1/user/refresh",
        { token: user.refreshToken }
      );
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["Authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleLogout = async () => {
    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/user/logout",
        { token: user.refreshToken },
        { headers: { Authorization: "Bearer " + user.accessToken } }
      )
      .then(() => {
        setUser("");
        setAccessToken("");
        localStorage.clear();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="homeHeaderNav actions">
      <div className="actionsLeft">
        <Link to="/profile">
          <Button type="primary" size="small" icon={<UserOutlined />}>Profile</Button>
        </Link>
      </div>
      <div className="actionsRight">
        <Button type="primary" size="small" danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};
