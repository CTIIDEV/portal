import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
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

import { OvertimeReq } from "../../components/overtimeReq/OvertimeReq";
import { OvertimeTable } from "../../components/overtimeTable/OvertimeTable";

import { UserContext } from "../../context/UserContext";

import "./overtime.css";

export const Overtime = () => {
  const [user, setUser] = useContext(UserContext);
  const [overtimes, setOvertimes] = useState([]);
  const [selectedOvertime, setSelectedOvertime] = useState([]);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
        .post(
          "http://localhost:5050/api/v1/overtime/view-manage",
          { department: user.userDept },
          { headers: { authorization: "Bearer " + user.accessToken } }
        )
        .then((result) => {
          // console.log(result)
          if (result.status === 200) {
            setOvertimes(result.data);
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

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:5050/api/v1/overtime/delete/${id}`)
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
      .get(`http://localhost:5050/api/v1/overtime/view/${id}`, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        console.log(result.data);
        setSelectedOvertime(result.data);
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

  // console.log(selectedOvertime[0]);

  const handleUpdate = async (id, status) => {
    await axiosJWT
      .put(
        `http://localhost:5050/api/v1/overtime/update/${id}`,
        {
          overtimeStatus: status,
        },
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
    <div className="overtime-page">
      <div className="overtime-page__overtime-container">
        <div className="overtime-container__list">
          <div className="list__list-table">
            <Table
              dataSource={overtimes}
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
                title="Requested Date"
                dataIndex="overtimeDateReq"
                render={(overtimeDateReq) => {
                  return (
                    <>{moment(overtimeDateReq).format("ddd, Do MMM YYYY")}</>
                  );
                }}
              />
              <Column
                title="Begin"
                dataIndex="overtimeBegin"
                render={(overtimeBegin) => {
                  return (
                    <>{moment(overtimeBegin, ["HH:mm"]).format("HH:mm: A")}</>
                  );
                }}
              />
              <Column
                title="Ends"
                dataIndex="overtimeEnds"
                render={(overtimeEnds) => {
                  return (
                    <>{moment(overtimeEnds, ["HH:mm"]).format("HH:mm: A")}</>
                  );
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
        title="Overtime Information"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        width={1000}
        footer={[
          <Button
            className="modal-buttons__approve"
            onClick={() => handleUpdate(selectedOvertime.id, "approved")}
          >
            Approve
          </Button>,
          <Button
            className="modal-buttons__reject"
            onClick={() => handleUpdate(selectedOvertime.id, "rejected")}
          >
            Reject
          </Button>,
        ]}
      >
        <Descriptions layout="horizontal">
          {selectedOvertime[0] && (
            <>
              <Descriptions.Item label="ID">
                {selectedOvertime[0].users.userId}
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {selectedOvertime[0].users.userFirstName +
                  " " +
                  selectedOvertime[0].users.userLastName}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedOvertime[0].users.userDept}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedOvertime[0].overtimeStatus === "rejected" ? (
                  <Tag color="error">Rejected</Tag>
                ) : selectedOvertime[0].overtimeStatus === "processing" ? (
                  <Tag color="processing">Processing</Tag>
                ) : (
                  <Tag color="success">Approved</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="From">
                {moment(selectedOvertime[0].overtimeBegin, ["HH:mm"]).format(
                  "HH:mm: A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="To">
                {moment(selectedOvertime[0].overtimeEnds, ["HH:mm"]).format(
                  "HH:mm: A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Reason" span={3}>
                {selectedOvertime[0].overtimeDesc}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Modal>
    </div>
  );
};
