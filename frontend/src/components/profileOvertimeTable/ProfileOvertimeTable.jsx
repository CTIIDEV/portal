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
  Row,
  Space,
  Table,
  Tag,
} from "antd";

import { UserContext } from "../../context/UserContext";

import "./profileOvertimeTable.css";

export const ProfileOvertimeTable = () => {
  const [user, setUser] = useContext(UserContext);
  const [overtimes, setOvertimes] = useState([]);
  const [selectedOvertime, setSelectedOvertime] = useState([]);
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
        .get(`http://localhost:5050/api/v1/overtime/get-user/${user.userId}`, {
          headers: { authorization: "Bearer " + user.accessToken },
        })
        .then((result) => {
          // console.log(result);
          setOvertimes(result.data);
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
      .get(`http://localhost:5050/api/v1/overtime/view/${id}`, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        // console.log(result.data);
        if (result.status === 200) {
          setSelectedOvertime(result.data[0]);
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
      .delete(`http://localhost:5050/api/v1/overtime/delete/${id}`, {
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
    <div className="tabs-overtime">
      <div className="tabs-overtime__overtime-container">
        <div className="tabs-container__list">
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
                title="Request Date"
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
                title="Status"
                dataIndex="overtimeStatus"
                render={(overtimeStatus) => {
                  if (overtimeStatus === "rejected") {
                    return <Tag color="error">Rejected</Tag>;
                  } else if (overtimeStatus === "processing") {
                    return <Tag color="processing">Processing</Tag>;
                  } else if (overtimeStatus === "approved") {
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
                      title="Delete this overtime request?"
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
            title="Overtime Details"
            centered
            visible={visible}
            onCancel={() => setVisible(false)}
            width={"50%"}
            footer={null}
          >
            <Descriptions layout="vertical">
              {selectedOvertime.users && (
                <>
                  <Descriptions.Item label="ID">
                    {selectedOvertime.users.userId}
                  </Descriptions.Item>
                  <Descriptions.Item label="Name">
                    {selectedOvertime.users.userFirstName +
                      " " +
                      selectedOvertime.users.userLastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    {selectedOvertime.overtimeStatus === "processing" ? (
                      <Tag color="processing">Processing</Tag>
                    ) : selectedOvertime.overtimeStatus === "rejected" ? (
                      <Tag color="error">Rejected</Tag>
                    ) : (
                      <Tag color="success">Approved</Tag>
                    )}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Request Date">
                {moment(selectedOvertime.overtimeDateReq).format(
                  "ddd, Do MMM YYYY"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Begin">
                {moment(selectedOvertime.overtimeBegin, ["HH:mm"]).format(
                  "HH:mm: A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ends">
                {moment(selectedOvertime.overtimeEnds, ["HH:mm"]).format(
                  "HH:mm: A"
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Description">
                {selectedOvertime.overtimeDesc}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
      </div>
    </div>
  );
};
