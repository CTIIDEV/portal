import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Button, Descriptions, Modal, Space, Table, Tag } from "antd";

import { UserContext } from "../../context/UserContext";

import "./profileAsgmtTable.css";

export const ProfileAsgmtTable = () => {
  const [user, setUser] = useContext(UserContext);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState([]);
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
        .get(`http://localhost:5050/api/v1/assignment/view-user/${user.id}`, {
          headers: { Authorization: "Bearer " + user.accessToken },
        })
        .then((result) => {
          setAssignments(result.data);
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
      .get(`http://localhost:5050/api/v1/assignment/view/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        setSelectedAssignment(result.data[0]);
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

  console.log(selectedAssignment);

  return (
    <div className="profileAsgmtTable">
      <div className="componentContainer">
        <span className="componentTitle">List of Assignments</span>
      </div>
      <Table
        dataSource={assignments}
        pagination={{
          pageSize: 5,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Description" dataIndex="description" key="description" />
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
          <span className="componentTitle">Assignmnet Detail</span>
        </div>
        <Descriptions layout="horizontal">
          <Descriptions.Item label="Title" span={2}>
            {selectedAssignment.title}
          </Descriptions.Item>
          <Descriptions.Item label="Urgency">
            {selectedAssignment.urgency === "high" ? (
              <Tag color="error">High</Tag>
            ) : selectedAssignment.urgency === "moderate" ? (
              <Tag color="warning">Moderate</Tag>
            ) : (
              <Tag color="success">Low</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Date" span={3}>
            {selectedAssignment.assignmentBegin + " "}
            {selectedAssignment.assignmentEnd}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            {selectedAssignment.title}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
