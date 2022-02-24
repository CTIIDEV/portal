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

import { UserContext } from "../../context/UserContext";

import "./supportTable.css";

export const SupportTable = ({ refresh, updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState([]);
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
        .get(`http://localhost:5050/api/v1/ticket/get-user/${user.id}`, {
          headers: { Authorization: "Bearer " + user.accessToken },
        })
        .then((result) => {
          setTickets(result.data);
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
      .get(`http://localhost:5050/api/v1/ticket/view/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        setSelectedTicket(result.data);
        setVisible(true);
      });
  };

  const handleDelete = async (id) => {
    await axiosJWT
      .delete(`http://localhost:5050/api/v1/ticket/delete/${id}`, {
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
    <div className="supportTable">
      <div className="componentContainer">
        <span className="componentTitle">Support Ticket Status</span>
      </div>
      <Table
        dataSource={tickets}
        pagination={{
          pageSize: 10,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column title="Title" dataIndex="title" key="test" />
        <Column
          title="Date Req"
          dataIndex="dateReq"
          key="dateReq"
          render={(dateReq) => {
            return <>{moment(dateReq).format("dddd, Do MMM YYYY")}</>;
          }}
        />
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
          title="Solved"
          dataIndex="solved"
          key="solved"
          render={(solved) => {
            if (solved === true) {
              return <Tag color="success">Solved</Tag>;
            } else if (solved === false) {
              return <Tag color="processing">Processing</Tag>;
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
        title="Ticket Information"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Descriptions layout="horizontal">
          <Descriptions.Item label="Title">
            {selectedTicket.title}
          </Descriptions.Item>
          <Descriptions.Item label="Date Request" span={2}>
            {moment(selectedTicket.dateReq).format("dddd, Do MMM YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Urgency">
            {selectedTicket.urgency === "high" ? (
              <Tag color="error">High</Tag>
            ) : selectedTicket.urgency === "moderate" ? (
              <Tag color="warning">Moderate</Tag>
            ) : (
              <Tag color="success">Low</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Solved">
            {selectedTicket.solved === true ? (
              <Tag color="success">Solved</Tag>
            ) : (
              <Tag color="processing">Processing</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item></Descriptions.Item>
          <Descriptions.Item label="Descriptions">
            {selectedTicket.description}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
