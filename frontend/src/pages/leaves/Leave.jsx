import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
import {
  Button,
  Descriptions,
  Image,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";

import { LeavePolicy } from "../../components/leavePolicy/LeavePolicy";
import { LeaveReq } from "../../components/leaveReq/LeaveReq";
import { LeaveTable } from "../../components/leaveTable/leaveTable";

import { UserContext } from "../../context/UserContext";

import "./leave.css";
import { RestTwoTone } from "@ant-design/icons";

export const Leave = () => {
  const [user, setUser] = useContext(UserContext);
  const [leaves, setLeaves] = useState([]);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
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
        .post(
          "http://localhost:5050/api/v1/leave/view-manage",
          { department: user.userDept },
          { headers: { authorization: "Bearer " + user.accessToken } }
        )
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

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:5050/api/v1/leave/delete/${id}`)
      .then((result) => {
        if (result.data) {
          message.success(result.data.message);
          setRefresh(true);
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

  const handleView = async (id) => {
    await axiosJWT
      .get(`http://localhost:5050/api/v1/leave/view/${id}`, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        console.log(result.data);
        setSelectedLeaves(result.data);
        setVisible(true);
      })
      .catch((error) => {
        if (error.response) {
          message.error(
            "[" + error.response.status + "] - " + error.response.data.message
          );
        }
      });
  };

  const convertImage = (file) => {
    if (file) {
      // const converted = Buffer.from(file.data).toString("base64");
      const converted = Buffer.from(file.data).toString("ascii");
      // console.log(converted);
      return converted;
    }
  };

  const handleUpdate = async (id, status) => {
    console.log(id + " " + status);
    await axiosJWT
      .put(
        `http://localhost:5050/api/v1/leave/update/${id}`,
        { leaveStatus: status },
        { headers: { authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        if (result.data) {
          message.success(result.data.message);
          setRefresh(true);
          setVisible(false);
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

  return (
    <div className="leave-page">
      <div className="leave-page__leave-container">
        <div className="leave-container__list">
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
                title="Name"
                dataIndex="users"
                render={(users) => {
                  return <>{users.userFirstName + " " + users.userLastName}</>;
                }}
              />
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
                  return (
                    <Space className="list-table__table-buttons" size="medium">
                      <Button
                        className="table-buttons__view"
                        size="small"
                        onClick={() => handleView(record.id)}
                      >
                        View
                      </Button>
                      <Popconfirm
                        className="table-buttons__delete"
                        title="Delete this User?"
                        onCancel={handleCancel}
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => handleRemove(record.id)}
                      >
                        <a href="#">Remove Request</a>
                      </Popconfirm>
                    </Space>
                  );
                }}
              />
            </Table>
          </div>
        </div>
      </div>
      <Modal
        title="Leave Information"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        width={1000}
        footer={[
          <Button
            className="modal-buttons__approve"
            onClick={() => handleUpdate(selectedLeaves.id, "approved")}
          >
            Approve
          </Button>,
          <Button
            className="modal-buttons__reject"
            onClick={() => handleUpdate(selectedLeaves.id, "rejected")}
          >
            Reject
          </Button>,
        ]}
      >
        <Descriptions layout="horizontal">
          {selectedLeaves.users ? (
            <>
              <Descriptions.Item label="ID">
                {selectedLeaves.users.userId}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {selectedLeaves.users.userFirstName +
                  " " +
                  selectedLeaves.users.userLastName}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedLeaves.users.userDept}
              </Descriptions.Item>
            </>
          ) : (
            <></>
          )}
          <Descriptions.Item label="Status">
            {selectedLeaves.leaveStatus === "rejected" ? (
              <Tag color="error">Rejected</Tag>
            ) : selectedLeaves.leaveStatus === "processing" ? (
              <Tag color="processing">Processing</Tag>
            ) : (
              <Tag color="success">Approved</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="From">
            {moment(selectedLeaves.leaveBegin).format("dddd, D MMM YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="To">
            {moment(selectedLeaves.leaveEnds).format("dddd, D MMM YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Reason" span={3}>
            {selectedLeaves.leaveDesc}
          </Descriptions.Item>
          <Descriptions.Item label="Image" span={3}>
            <Image
              width={500}
              src={`${convertImage(selectedLeaves.leaveImage)}`}
              alt=""
            />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
