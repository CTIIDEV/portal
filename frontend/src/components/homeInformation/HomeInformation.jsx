import { useContext, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import jwt from "jwt-decode";
import { Button, message, Popconfirm, Space, Table, Tag, Typography } from "antd";

import { UserContext } from "../../context/UserContext";

import "./homeInformation.css";

export const HomeInformation = () => {
  const [user, setUser] = useContext(UserContext);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);

  const { Column } = Table;
  const { Title, Text } = Typography;

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
        .get(`http://localhost:5050/api/v1/schedule/view/${user.userId}`, {
          headers: { authorization: "Bearer " + user.accessToken },
        })
        .then((result) => {
          setSchedules(result.data);
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

  return (
    <div className="home-container__information">
      <div className="information__information-user">
        <Text style={{ margin: 0, flex: 1, marginRight: "5px", fontSize: "24px" }}>
          Welcome back,
        </Text>
        <Title level={3} style={{ margin: 0, flex: 3 }}>
          {user.userFirstName + " " + user.userLastName}
        </Title>
      </div>
      <div className="information__information-schedule">
        <Table
          dataSource={schedules}
          pagination={{
            pageSize: 5,
            position: ["none", "bottomRight"],
            simple: true,
          }}
        >
          <Column title="Title" dataIndex="scheduleTitle" key="title" />
          <Column
            title="Date"
            dataIndex="scheduleDate"
            key="date"
            render={(scheduleDate) => {
              return moment(scheduleDate).format("ddd, Do MMM YYYY");
            }}
          />
          <Column
            title="Actions"
            render={(text, record) => {
              <Space className="list-table__table-buttons" size="medium">
                <Button
                  className="table-buttons__view"
                  size="small"
                  // onClick={() => handleView(record.userId)}
                >
                  View
                </Button>
                <Popconfirm
                  className="table-buttons__delete"
                  title="Delete this User?"
                  // onConfirm={() => handleDelete(record.userId)}
                  // onCancel={handleCancel}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <a href="#">Delete</a>
                </Popconfirm>
              </Space>;
            }}
          />
        </Table>
      </div>
      {/* <div className="information__information-details">
        <Descriptions layout="vertical">
          <Descriptions.Item label="Role">{user.userRole}</Descriptions.Item>
          <Descriptions.Item label="Department" span={2}>
            {user.userDept}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>
            {user.userEmail}
          </Descriptions.Item>
        </Descriptions>
      </div> */}
      {/* <div className="information__information-actions">
        <Button type="dashed">Go to profile</Button>
      </div> */}
    </div>
  );
};
