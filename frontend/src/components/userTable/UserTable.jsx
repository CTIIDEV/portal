import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import {
  Button,
  Descriptions,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";

import { UserContext } from "../../context/UserContext";

import "./userTable.css";

export const UserTable = ({ refresh, updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [visible, setVisible] = useState(false);

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
      await axios
        .post("http://localhost:5050/api/v1/user/users", {
          department: user.userDept,
          role: user.userRole,
        })
        .then((result) => {
          if (result.status === 200) {
            setUsers(result.data);
          }
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

  const handleView = async (id) => {
    await axiosJWT
      .get(`http://localhost:5050/api/v1/user/${id}`, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        console.log(result.data);
        if (result.status === 200) {
          setSelectedUser(result.data);
          setVisible(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          message.error(
            "[" + error.response.status + "] - " + error.response.data.message
          );
        }
      });
  };

  const handleDelete = async (id) => {
    await axiosJWT
      .delete(`http://localhost:5050/api/v1/user/delete/${id}`, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        if (result.status === 200) {
          message.success(result.data.message);
          updateRefresh(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          message.error(
            "[" +
              error.response.status +
              "] - " +
              error.response.data.error.name +
              " | " +
              error.response.data.message
          );
        }
      });
  };

  const handleCancel = () => {
    message.error("Cancel action.");
  };

  return (
    <div className="userTable">
      <Table
        dataSource={users}
        pagination={{
          pageSize: 10,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column title="ID" dataIndex="userId" key="id" />
        <Column
          title="Name"
          key="Name"
          render={(text, record) =>
            record.userFirstName + " " + record.userLastName
          }
        />
        <Column
          title="Department"
          dataIndex="userDept"
          key="department"
          filters={[
            { text: "Finance & Accounting", value: "Finance & Accounting" },
            { text: "Legal & Compliance", value: "Legal & Compliance" },
            { text: "Risk & Management", value: "Risk & Management" },
            { text: "Claim", value: "Claim" },
            { text: "Reinsurance", value: "Reinsurance" },
            { text: "Underwriting", value: "Underwriting" },
            { text: "China Biz", value: "China Biz" },
            { text: "PPU", value: "PPU" },
            { text: "China Biz", value: "China Biz" },
            { text: "HR & Admin", value: "HR & Admin" },
            { text: "IT", value: "IT" },
            { text: "Marketing Rep Office", value: "Marketing Rep Office" },
            { text: "Agent A", value: "Agent A" },
            { text: "Agent B", value: "Agent B" },
          ]}
          onFilter={(value, record) => {
            return record.userDept.indexOf(value) === 0;
          }}
        />
        <Column
          title="Role"
          dataIndex="userRole"
          key="role"
          filters={[
            { text: "Admin", value: "Admin" },
            { text: "Moderator", value: "Moderator" },
            { text: "User", value: "User" },
          ]}
          onFilter={(value, record) => {
            return record.userRole.indexOf(value) === 0;
          }}
          render={(userRole) => {
            if (userRole === "Admin") {
              return <Tag color="#f50">Admin</Tag>;
            } else if (userRole === "Moderator") {
              return <Tag color="#87d068">Moderator</Tag>;
            } else if (userRole === "User") {
              return <Tag color="#2db7f5">User</Tag>;
            }
          }}
        />
        {user.userDept == "HR & Admin" && (
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space className="tableActions" size="medium">
                <Button
                  className="actionView"
                  size="small"
                  onClick={() => handleView(record.userId)}
                >
                  View
                </Button>
                <Popconfirm
                  className="actionDelete"
                  title="Delete this User?"
                  onConfirm={() => handleDelete(record.userId)}
                  onCancel={handleCancel}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <a href="#">Delete</a>
                </Popconfirm>
              </Space>
            )}
          />
        )}
      </Table>
      <Modal
        title="User Information"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <Descriptions layout="vertical">
          <Descriptions.Item label="ID">
            {selectedUser.userId}
          </Descriptions.Item>
          <Descriptions.Item label="Fullname">
            {selectedUser.userFirstName + " " + selectedUser.userLastName}
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {selectedUser.userDept}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {selectedUser.userEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            {selectedUser.userRole === "Admin" ? (
              <Tag color="#f50">Admin</Tag>
            ) : selectedUser.userRole === "Moderator" ? (
              <Tag color="#87d068">Moderator</Tag>
            ) : (
              <Tag color="#2db7f5">User</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
