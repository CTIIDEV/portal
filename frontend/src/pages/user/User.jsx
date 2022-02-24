import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import {
  Button,
  Descriptions,
  message,
  Modal,
  Popconfirm,
  Popover,
  Row,
  Space,
  Table,
  Tag,
} from "antd";

import { UserContext } from "../../context/UserContext";

import "./user.css";

export const User = () => {
  const [user, setUser] = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [selectedUserDelete, setSelectedUserDelete] = useState("");

  const { Column } = Table;

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
    setRefresh(false);
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

  const handleDeleteView = (id) => {
    setVisiblePopover(true);
    setSelectedUserDelete(id);
  };

  const handleDelete = async (id) => {
    await axiosJWT
      .delete(`http://localhost:5050/api/v1/user/delete/${id}`, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        if (result.status === 200) {
          message.success(result.data.message);
          setRefresh(true);
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

  return (
    <div className="user-page">
      <div className="user-page__user-container">
        <div className="user-container__list">
          <div className="list__list-table">
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
                key="name"
                render={(text, record) =>
                  record.userFirstName + " " + record.userLastName
                }
              />
              <Column
                title="Department"
                dataIndex="userDept"
                key="department"
                filters={[
                  {
                    text: "Finance & Accounting",
                    value: "Finance & Accounting",
                  },
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
                  {
                    text: "Marketing Rep Office",
                    value: "Marketing Rep Office",
                  },
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
                    <Space className="list-table__table-buttons" size="medium">
                      <Button
                        className="table-buttons__view"
                        size="small"
                        onClick={() => handleView(record.userId)}
                      >
                        View
                      </Button>
                      <Button
                        className="table-buttons__delete"
                        size="small"
                        onClick={() => handleDeleteView(record.userId)}
                      >
                        Delete
                      </Button>
                      {/* <Button
                        className="table-buttons__delete"
                        size="small"
                        onClick={() => handleVisiblePopover()}
                      >
                        Delete
                      </Button> */}
                      {/* <Popconfirm
                        className="table-buttons__delete"
                        title="Delete this user?"
                        onConfirm={() => handleDelete(record.userId)}
                        onCancel={() => message.error("Cancel action.")}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <a href="#">Delete</a>
                      </Popconfirm> */}
                    </Space>
                  )}
                />
              )}
            </Table>
          </div>
          <Modal
            className="list__list-view"
            title="User Information"
            centered
            visible={visible}
            onCancel={() => setVisible(false)}
            width={1000}
            footer={null}
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
          <Modal
            className="list__list-view"
            title="Are you sure?"
            centered
            visible={visiblePopover}
            onCancel={() => setVisiblePopover(false)}
            footer={null}
          >
            <Row>
              Once User is deleted, it will be removed from the database.
            </Row>
            <Row>
              <Button onClick={() => handleDelete(selectedUserDelete)}>
                Yes
              </Button>
              <Button
                onClick={() => {
                  setVisiblePopover(false);
                  setSelectedUserDelete("");
                }}
              >
                Cancel
              </Button>
            </Row>
          </Modal>
        </div>
      </div>
    </div>
  );
};
