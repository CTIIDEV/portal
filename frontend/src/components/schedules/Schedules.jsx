import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
import { Button, Descriptions, Modal, Space, Table, Tag } from "antd";

import { UserContext } from "../../context/UserContext";

import "./schedules.css";

export const Schedules = ({ refresh, updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [schedules, setSechedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
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
        .get(`http://localhost:5050/api/v1/task/view-user/${user.id}`, {
          headers: { Authorization: "Bearer " + user.accessToken },
        })
        .then((result) => {
          setSechedules(result.data);
          updateRefresh(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [refresh]);

  const handleView = async (id) => {
    setVisible(true);
    await axiosJWT
      .get(`http://localhost:5050/api/v1/task/view/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        setSelectedSchedule(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    setSelectedSchedule([]);
    setVisible(false);
  };

  return (
    <div className="schedules">
      <div className="componentContainer">
        <span className="componentTitle">Schedules</span>
      </div>
      <Table
        dataSource={schedules}
        pagination={{
          pageSize: 5,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column title="Title" dataIndex="title" key="title" />
        <Column
          title="Urgency"
          dataIndex="urgency"
          key="urgency"
          render={(urgency) => {
            if (urgency === "high") {
              return <Tag color="error">High</Tag>;
            } else if (urgency === "moderate") {
              return <Tag color="warning">Moderate</Tag>;
            } else if (urgency === "low") {
              return <Tag color="success">Low</Tag>;
            }
          }}
        />
        <Column
          title="Date"
          dataIndex="date"
          key="date"
          render={(date) => {
            var date = moment(date).format("ddd, Do MMM YYYY");
            return date;
          }}
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <Space className="tableActions" size="medium">
              <Button
                className="actionView"
                size="small"
                onClick={() => handleView(record.id)}
              >
                View
              </Button>
            </Space>
          )}
        />
      </Table>
      <Modal visible={visible} onCancel={handleCancel} footer={null}>
        <div className="componentContainer">
          <span className="compnentTitle">Schedule Detail</span>
        </div>
        <Descriptions layout="horizontal">
          <Descriptions.Item label="Title" span={2}>
            {selectedSchedule.title}
          </Descriptions.Item>
          <Descriptions.Item label="Urgency">
            {selectedSchedule.urgency === "high" ? (
              <Tag color="error">High</Tag>
            ) : selectedSchedule.urgency === "moderate" ? (
              <Tag color="warning">Moderate</Tag>
            ) : (
              <Tag color="success">Low</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Date" span={3}>
            {moment(selectedSchedule.date).format("dddd, Do MMMM YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            {selectedSchedule.description}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      {/* {schedules.map((schedule) => {
        console.log(schedule)
        // console.log(moment(schedule.date).dayOfYear());
        var date = moment(schedule.date).format("ddd, Do MMM YYYY");
        return (
          <div className="scheduleItem ">
            <div className="scheduleDate">
              <Title level={5}>{date}</Title>
            </div>
            <div className="scheduleHeader">
              <div className="scheduleTitle">
                <Title level={3} style={{ marginBottom: 0 }}>
                  {schedule.title}
                </Title>
              </div>
              <div className="scheduleUrgency">
                Urgency:{" "}
                {schedule.urgency === "high" ? (
                  <Tag color="error" size="small">
                    High
                  </Tag>
                ) : schedule.urgency === "moderate" ? (
                  <Tag color="warning" size="small">
                    Moderate
                  </Tag>
                ) : (
                  <Tag color="success" size="small">
                    Low
                  </Tag>
                )}
              </div>
            </div>
            <div className="scheduleFooter">
              <Collapse>
                <Panel header="Description">
                  <p>{schedule.description}</p>
                </Panel>
              </Collapse>
            </div>
          </div>
        );
      })} */}
    </div>
  );
};
