import { useContext, useEffect, useState } from "react";
import axios from "axios";
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

import { UserContext } from "../../context/UserContext";

import "./asgmtTable.css";

export const AsgmtTable = ({ refresh, updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [assignments, setAssingments] = useState([]);
  const [selectedAsgmt, setSelectedAsgmt] = useState([]);
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
        .get(
          `http://localhost:5050/api/v1/assignment/view-dept/${user.department}`,
          {
            headers: { Authorization: "Bearer " + user.accessToken },
          }
        )
        .then((result) => {
          // console.log(result.data);
          setAssingments(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
    updateRefresh(false);
  }, [refresh]);

  const handleView = async (id) => {
    await axiosJWT
      .get(`http://localhost:5050/api/v1/assignment/view/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        console.log(result.data[0]);
        setSelectedAsgmt(result.data[0]);
        setVisible(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (id) => {
    await axiosJWT
      .delete(`http://localhost:5050/api/v1/assignment/delete/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        message.success(result.data.message);
        updateRefresh(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = () => {
    message.error("Cancel Deleting Assignment");
  };

  return (
    <div className="asgmtTable">
      <div className="componentContainer">
        <span className="componentTitle">List of Assignments</span>
      </div>
      <Table
        dataSource={assignments}
        pagination={{
          pageSize: 10,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Department" dataIndex="department" key="department" />
        <Column
          title="Urgency"
          dataIndex="urgency"
          key="urgency"
          filters={[
            { text: "High", value: "high" },
            { text: "Moderate", value: "moderate" },
            { text: "Low", value: "low" },
          ]}
          onFilter={(value, record) => {
            return record.urgency.indexOf(value) === 0;
          }}
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
              <Popconfirm
                className="actionDelete"
                title="Delete this Assignment?"
                onConfirm={() => handleDelete(record.id)}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel"
              >
                <a href="#">Delete</a>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
      <Modal
        title="Assignment Information"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <Descriptions layout="horizontal">
          <Descriptions.Item label="Title">
            {selectedAsgmt.title}
          </Descriptions.Item>
          <Descriptions.Item label="Assigned To">
            {Object.entries(selectedAsgmt.users || {}).map((result) => {
              return (
                <Tag>{result[1].firstName + " " + result[1].lastName}</Tag>
              );
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {selectedAsgmt.department}
          </Descriptions.Item>
          <Descriptions.Item label="Urgency">
            {selectedAsgmt.urgency === "high" ? (
              <Tag color="error">High</Tag>
            ) : selectedAsgmt.urgency === "moderate" ? (
              <Tag color="warning">Moderate</Tag>
            ) : (
              <Tag color="success">Low</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Begin">
            {selectedAsgmt.assignmentBegin}
          </Descriptions.Item>
          <Descriptions.Item label="Deadline">
            {selectedAsgmt.assignmentEnd}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            {selectedAsgmt.description}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
