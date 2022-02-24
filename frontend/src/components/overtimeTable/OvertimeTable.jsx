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
  Table,
  Tag,
} from "antd";

import { UserContext } from "../../context/UserContext";

import "./overtimeTable.css";

export const OvertimeTable = ({ refresh, updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [overtimes, setOvertimes] = useState([]);
  const [selectedOvertime, setSelectedOvertime] = useState([]);
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
      await axiosJWT
        .get(`http://localhost:5050/api/v1/overtime/get-user/${user.userId}`, {
          headers: { authorization: "Bearer " + user.accessToken },
        })
        .then((result) => {
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
    updateRefresh(false);
  }, [refresh]);

  // const handleView = async (id) => {
  //   await axiosJWT
  //     .get(`http://localhost:5050/api/v1/overtime/view/${id}`, {
  //       headers: { authorization: "Bearer " + user.accessToken },
  //     })
  //     .then((result) => {
  //       setSelectedOvertime(result.data[0]);
  //       setVisible(true);
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         message.error(
  //           "[" + error.response.status + "] - " + error.response.data.message
  //         );
  //       }
  //     });
  // };

  const handleRemove = (id) => {
    axios
      .delete(`http://localhost:5050/api/v1/overtime/delete/${id}`)
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

  return (
    <div className="overtimeTable">
      <div className="componentContainer">
        <span className="componentTitle">List of Overtime Requests</span>
      </div>
      <Table
        dataSource={overtimes}
        pagination={{
          pageSize: 10,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column
          title="Requested on"
          dataIndex="overtimeDateReq"
          key="overtimeDateReq"
          render={(overtimeDateReq) => {
            return <>{moment(overtimeDateReq).format("ddd, Do MMM YYYY")}</>;
          }}
        />
        <Column
          title="Begin"
          dataIndex="overtimeBegin"
          key="overtimeBegin"
          render={(overtimeBegin) => {
            return <>{moment(overtimeBegin, ["HH:mm"]).format("HH:mm: A")}</>;
          }}
        />
        <Column
          title="Ends"
          dataIndex="overtimeEnds"
          key="overtimeEnds"
          render={(overtimeEnds) => {
            return <>{moment(overtimeEnds, ["HH:mm"]).format("HH:mm: A")}</>;
          }}
        />
        <Column
          title="Action"
          render={(text, record) => {
            if (record.overtimeStatus == "processing") {
              return (
                <>
                  {/* <Button
                    className="actionView"
                    size="small"
                    onClick={() => handleView(record.id)}
                  >
                    View
                  </Button> */}
                  <Button
                    className="actionDelete"
                    size="small"
                    onClick={() => handleRemove(record.id)}
                  >
                    Remove Request
                  </Button>
                </>
              );
            } else if (
              record.overtimeStatus == "approved" ||
              record.overtimeStatus == "rejected"
            ) {
              return (
                <>
                  {/* <Button
                    className="actionView"
                    size="small"
                    onClick={() => handleView(record.id)}
                  >
                    View
                  </Button> */}
                  <Button
                    className="actionDelete"
                    size="small"
                    onClick={() => handleRemove(record.id)}
                  >
                    Remove Request
                  </Button>
                </>
              );
            }
          }}
        />
      </Table>
      <Modal
        title="Overtime Request Information"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <div className="overtimeInformation">
          <Descriptions layout="horizontal">
            <Descriptions.Item label="Overtime Date" span={2}>
              {moment(selectedOvertime.dateRequest).format("ddd, Do MMM YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedOvertime.status === "rejected" ? (
                <Tag color="error">Rejected</Tag>
              ) : selectedOvertime.status === "processing" ? (
                <Tag color="processing">Processing</Tag>
              ) : (
                <Tag color="success">Approved</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Overtime Time" span={3}>
              <div className="fromTime">
                {moment(selectedOvertime.fromTime, ["HH:mm"]).format("HH:mm A")}
              </div>
              <div className="toTime">
                {moment(selectedOvertime.toTime, ["HH:mm"]).format("HH:mm A")}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Descriptions" span={3}>
              {selectedOvertime.description}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </div>
  );
};
