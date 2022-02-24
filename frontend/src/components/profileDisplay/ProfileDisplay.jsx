import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Avatar, Card, Descriptions, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { UserContext } from "../../context/UserContext";

import "./profileDisplay.css";

export const ProfileDisplay = ({ refresh, updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);

  const { Title } = Typography;

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

  useEffect(() => {
    const fetchData = async () => {
      await axiosJWT
        .get(`http://localhost:5050/api/v1/user/${user.id}`)
        .then((result) => {
          // console.log(result.data);
          setUser({
            ...user,
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
    updateRefresh(false);
  }, [refresh]);

  return (
    <div className="profileDisplay">
      <div className="profileContainer">
        <div
          className="img"
          style={{
            flex: "1",
            padding: "20px",
            // background: "lightblue",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          <Avatar size={96} icon={<UserOutlined />} />
        </div>
        <div
          className="data"
          style={{
            flex: "2",
            padding: "20px",
            // background: "lightyellow",
          }}
        >
          <Title level={4}>
            {user.userFirstName + " " + user.userLastName}
          </Title>
          <div className="tagRole" style={{ marginBottom: "0.5rem" }}>
            {user.userRole === "Admin" ? (
              <Tag color="#f50">Admin</Tag>
            ) : user.userRole === "Moderator" ? (
              <Tag color="#87d068">Moderator</Tag>
            ) : (
              <Tag color="#2db7f5">User</Tag>
            )}
          </div>
          <Title level={5} type="secondary">
            {"Department: " + user.userDept}
          </Title>
          {user.userEmail}
        </div>
      </div>
    </div>
  );
};
