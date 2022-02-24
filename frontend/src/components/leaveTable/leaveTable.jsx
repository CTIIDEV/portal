import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
import { Button, message, Popconfirm, Table, Tag } from "antd";

import { UserContext } from "../../context/UserContext";

import "./leaveTable.css";

export const LeaveTable = ({ refresh, updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [leaves, setLeaves] = useState([]);

  const { Column } = Table;

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
        .get(`http://localhost:5050/api/v1/leave/get-user/${user.userId}`, {
          headers: { Authorization: "Bearer " + user.accessToken },
        })
        .then((result) => {
          setLeaves(result.data);
        })
        .catch((error) => {
          if (error.response) {
            message.error(
              "[" + error.response.status + "] - " + error.response.data.message
            );
          }
        });
    };
    fetchData();
    updateRefresh(false);
  }, [refresh]);

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:5050/api/v1/leave/delete/${id}`)
      .then((result) => {
        if (result.data) {
          message.success(result.data.message);
          updateRefresh(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          message.error(
            "[" + error.response.status + "] - " + error.response.statusText
          );
        }
      });
  };

  const handleCancel = () => {
    message.error("Cancel action.");
  };

  return (
    <div className="leaveTable">
      <div className="componentContainer">
        <span className="componentTitle">List of Leave Requests</span>
      </div>
      <Table
        dataSource={leaves}
        pagination={{
          pageSize: 10,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column
          title="Begin"
          dataIndex="leaveBegin"
          key="leaveBegin"
          render={(leaveBegin) => {
            return <>{moment(leaveBegin).format("ddd, Do MMM YYYY")}</>;
          }}
        />
        <Column
          title="End"
          dataIndex="leaveEnds"
          key="leaveEnds"
          render={(leaveEnds) => {
            return <>{moment(leaveEnds).format("ddd, Do MMM YYYY")}</>;
          }}
        />
        <Column
          title="Status"
          dataIndex="leaveStatus"
          key="leaveStatus"
          render={(leaveStatus) => {
            if (leaveStatus === "rejected") {
              return <Tag color="error">Rejected</Tag>;
            } else if (leaveStatus === "processing") {
              return <Tag color="processing">Processing</Tag>;
            } else if (leaveStatus === "approved") {
              return <Tag color="success">Approved</Tag>;
            }
          }}
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => {
            if (
              record.leaveStatus === "rejected" ||
              record.leaveStatus === "approved"
            ) {
              return (
                <Popconfirm
                  className="actionDelete"
                  title="Delete this User?"
                  onCancel={handleCancel}
                  okText="Delete"
                  cancelText="Cancel"
                  onConfirm={() => handleRemove(record.id)}
                >
                  <a href="#">Remove Request</a>
                </Popconfirm>
              );
            } else {
              return (
                <Popconfirm
                  className="actionDelete"
                  title="Delete this User?"
                  onCancel={handleCancel}
                  okText="Delete"
                  cancelText="Cancel"
                  onConfirm={() => handleRemove(record.id)}
                >
                  <a href="#">Cancel Request</a>
                </Popconfirm>
              );
            }
          }}
        />
      </Table>
    </div>
  );
};
