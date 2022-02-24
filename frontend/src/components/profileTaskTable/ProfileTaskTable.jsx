import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Button, Descriptions, Modal, Space, Table, Tag } from "antd";

import { UserContext } from "../../context/UserContext";

import "./profileTaskTable.css";

export const ProfileTaskTable = () => {
  const [user, setUser] = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
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
          // console.log(result);
          setTasks(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const handleView = async (id) => {
    setVisible(true);
    await axiosJWT
      .get(`http://localhost:5050/api/v1/task/view/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        // console.log(result);
        setSelectedTask(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    console.log("DELETE");
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="profileTaskTable">
      <div className="componentContainer">
        <span className="componentTitle">List of Tasks</span>
      </div>
      <Table
        dataSource={tasks}
        pagination={{
          pageSize: 5,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Date" dataIndex="date" key="date" />
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
          title="Action"
          key="action"
          render={(text, record) => (
            <Space className="tableActions" size="medium">
              <Button
                className="actionView"
                size="small"
                onClick={() => handleView(record.id)}
              >
                View
              </Button>
              <Button
                className="actionDelete"
                size="small"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
      <Modal visible={visible} onCancel={handleCancel} footer={null}>
        <div className="componentContainer">
          <span className="componentTitle">Task Detail</span>
        </div>
        <Descriptions layout="horizontal">
          <Descriptions.Item label="Title" span={3}>
            {selectedTask.title}
          </Descriptions.Item>
          <Descriptions.Item label="Urgency">
            {selectedTask.urgency === "high" ? (
              <Tag color="error">High</Tag>
            ) : selectedTask.urgency === "medium" ? (
              <Tag color="warning">Moderate</Tag>
            ) : (
              <Tag color="success">Low</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Date" span={2}>
            {selectedTask.date}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            {selectedTask.description}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
