import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
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

export const ProfileLeaveTable = () => {
  const [user, setUser] = useContext(UserContext);
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState([]);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
          headers: { authorization: "Bearer " + user.accessToken },
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
    setRefresh(false);
  }, [refresh]);

  const handleView = async (id) => {
    await axiosJWT
      .get(`http://localhost:5050/api/v1/leave/view/${id}`, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        if (result.status === 200) {
          setSelectedLeave(result.data);
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
      .delete(`http://localhost:5050/api/v1/leave/delete/${id}`, {
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
    <div className="tabs-leaves">
      <div className="tabs-leaves__leaves-container">
        <div className="leaves-container__list">
          <div className="list__list-table">
            <Table
              dataSource={leaves}
              pagination={{
                pageSize: 10,
                position: ["none", "bottomRight"],
                simple: true,
              }}
            >
              <Column
                title="Request On"
                dataIndex="createdAt"
                render={(createdAt) => {
                  return <>{moment(createdAt).format("ddd, Do MMM YYYY")} </>;
                }}
              />
              <Column
                title="Begin"
                dataIndex="leaveBegin"
                render={(leaveBegin) => {
                  return <>{moment(leaveBegin).format("ddd, Do MMM YYYY")}</>;
                }}
              />
              <Column
                title="Ends"
                dataIndex="leaveEnds"
                render={(leaveEnds) => {
                  return <>{moment(leaveEnds).format("ddd, Do MMM YYYY")}</>;
                }}
              />
              <Column
                title="Status"
                dataIndex="leaveStatus"
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
                render={(text, record) => (
                  <Space className="list-table__table-buttons" size="middle">
                    <Button
                      className="table-buttons__view"
                      size="small"
                      onClick={() => handleView(record.id)}
                    >
                      View
                    </Button>
                    <Popconfirm
                      className="table-buttons__delete"
                      title="Delete this leave request?"
                      onConfirm={() => handleDelete(record.id)}
                      onCancel={() => message.error("Cancel action.")}
                      okText="Delete"
                      cancelText="Cancel"
                    >
                      <a href="#">Delete</a>
                    </Popconfirm>
                  </Space>
                )}
              />
            </Table>
          </div>
          <Modal
            className="list__list-view"
            title="Leave Details"
            centered
            visible={visible}
            onCancel={() => setVisible(false)}
            width={"50%"}
            footer={null}
          >
            <Descriptions layout="vertical">
              {selectedLeave.users && (
                <>
                  <Descriptions.Item label="ID">
                    {selectedLeave.users.userId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Name">
                    {selectedLeave.users.userFirstName +
                      " " +
                      selectedLeave.users.userLastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {selectedLeave.leaveStatus === "processing" ? (
                      <Tag color="processing">Processing</Tag>
                    ) : selectedLeave.leaveStatus === "rejected" ? (
                      <Tag color="error">Rejected</Tag>
                    ) : (
                      <Tag color="success">Approved</Tag>
                    )}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Request On">
                {moment(selectedLeave.createdAt).format("ddd, Do MMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Begin">
                {moment(selectedLeave.leaveBegin).format("ddd, Do MMM YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Ends">
                {moment(selectedLeave.leaveEnds).format("ddd, Do MMM YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
      </div>
    </div>
  );
};
