import { useContext } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Menu } from "antd";
import { Link, useHistory } from "react-router-dom";

import { UserContext } from "../../context/UserContext";

import "./navbar.css";

export const Navbar = () => {
  const [user, setUser, accessToken, setAccessToken] = useContext(UserContext);
  const history = useHistory();

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
    <div className="navbar">
      <div className="navbarWrapper">
        <div className="topLeft">
          <span className="logo">Logo</span>
        </div>
        <div className="topRight">
          <Menu theme="light" mode="horizontal">
            <Menu.Item key="profile">
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item onClick={handleLogout} key="logout">
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </div>
  );
};
