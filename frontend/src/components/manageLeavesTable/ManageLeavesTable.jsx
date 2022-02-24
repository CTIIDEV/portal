import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
import { Button, Descriptions, message, Modal, Space, Table, Tag } from "antd";

import { UserContext } from "../../context/UserContext";

import "./manageLeavesTable.css";

export const ManageLeavesTable = () => {
  const [user, setUser] = useContext(UserContext);
  const [leaves, setLeaves] = useState([]);
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const { Column, ColumnGroup } = Table;

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
          {
            department: user.userDept,
          },
          { headers: { Authorization: "Bearer " + user.accessToken } }
        )
        .then((result) => {
          // console.log(result.data);
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

  const handleView = async (id) => {
    await axiosJWT
      .get(`http://localhost:5050/api/v1/leave/view/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        // console.log(result.data);
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

  const handleUpdate = async (id, status) => {
    await axiosJWT
      .put(
        `http://localhost:5050/api/v1/leave/update/${id}`,
        { status: status },
        {
          headers: { Authorization: "Bearer " + user.accessToken },
        }
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
    <div className="manageLeavesTable">
      <div className="componentContainer">
        <span className="componentTitle">List of Requests</span>
      </div>
      <Table
        dataSource={leaves}
        bordered
        pagination={{
          pageSize: 10,
          position: ["none", "bottomRight"],
          simple: true,
        }}
      >
        <Column title="ID" dataIndex="userId" key="userId" />
        <Column
          title="Name"
          render={(text, record) =>
            record.users.userFirstName + " " + record.users.userLastName
          }
        />
        <ColumnGroup title="Date">
          <Column
            title="From"
            dataIndex="fromDate"
            key="fromDate"
            render={(fromDate) => {
              return <>{moment(fromDate).format("ddd, Do MMM YY")}</>;
            }}
          />
          <Column
            title="To"
            dataIndex="toDate"
            key="toDate"
            render={(toDate) => {
              return <>{moment(toDate).format("ddd, Do MMM YY")}</>;
            }}
          />
        </ColumnGroup>
        <Column
          title="Actions"
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
            </Space>
          )}
        />
      </Table>
      <Modal
        title="Leave Information"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        width={1000}
        footer={[
          <Button
            className="actionApprove"
            onClick={() => handleUpdate(selectedLeaves.id, "approved")}
          >
            Approve
          </Button>,
          <Button
            className="actionReject"
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
            {selectedLeaves.status === "rejected" ? (
              <Tag color="error">Rejected</Tag>
            ) : selectedLeaves.status === "processing" ? (
              <Tag color="processing">Processing</Tag>
            ) : (
              <Tag color="success">Approved</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="From">
            {moment(selectedLeaves.fromDate).format("dddd, D MMM YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="To">
            {moment(selectedLeaves.toDate).format("dddd, D MMM YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Reason" span={3}>
            {selectedLeaves.reason}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
