import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";

import { Button, Descriptions, Modal, Space, Table, Tag } from "antd";

import { UserContext } from "../../context/UserContext";

import "./manageOvertimesTable.css";

export const ManageOvertimeTables = () => {
  const [user, setUser] = useContext(UserContext);
  const [overtimes, setOvertimes] = useState([]);
  const [selectedOvertimes, setSelectedOvertimes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await axiosJWT
  //       .post(
  //         "http://localhost:5050/api/v1/overtime/view-manage",
  //         { department: user.department },
  //         { headers: { Authorization: "Bearer " + user.accessToken } }
  //       )
  //       .then((result) => {
  //         setOvertimes(result.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   fetchData();
  //   setRefresh(false);
  // }, [refresh]);

  const handleView = async (id) => {
    await axiosJWT
      .get(`http://localhost:5050/api/v1/overtime/view/${id}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        setSelectedOvertimes(result.data[0]);
        console.log(result.data[0]);
        setVisible(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = async (id, status) => {
    console.log(id + " " + status);
    await axiosJWT
      .put(
        `http://localhost:5050/api/v1/overtime/update/${id}`,
        {
          status: status,
        },
        { headers: { Authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        console.log(result);
        setRefresh(true);
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="manageOvertimesTables">
      <div className="componentContainer">
        <span className="componentTitle">List of Overtime Requests</span>
      </div>
      <Table
        dataSource={overtimes}
        pagination={{
          pageSize: 10,
          position: ["none", "bottom"],
          simple: true,
        }}
      >
        <Column
          title="Name"
          dataIndex="users"
          key="tes"
          render={(users) => {
            return <>{users.firstName + " " + users.lastName}</>;
          }}
        />
        <Column
          title="Department"
          dataIndex="users"
          key="department"
          render={(users) => {
            return <>{users.department}</>;
          }}
        />
        <Column
          title="Date Requested"
          dataIndex="dateRequest"
          render={(dateRequest) => {
            return <>{moment(dateRequest).format("ddd, Do MMM YYYY")}</>;
          }}
        />
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
        title="Overtime Information"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            className="actionApprove"
            onClick={() => handleUpdate(selectedOvertimes.id, "approved")}
          >
            Approve
          </Button>,
          <Button
            className="actionReject"
            onClick={() => handleUpdate(selectedOvertimes.id, "rejected")}
          >
            Reject
          </Button>,
        ]}
      >
        <Descriptions layout="horizontal">
          {selectedOvertimes.users ? (
            <>
              <Descriptions.Item label="Fullname">
                {selectedOvertimes.users.firstName +
                  " " +
                  selectedOvertimes.users.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Department" span={2}>
                {selectedOvertimes.users.department}
              </Descriptions.Item>
            </>
          ) : (
            <> </>
          )}
          <Descriptions.Item label="Status" span={3}>
            {selectedOvertimes.status === "rejected" ? (
              <Tag color="error">Rejected</Tag>
            ) : selectedOvertimes.status === "processing" ? (
              <Tag color="processing">Processing</Tag>
            ) : (
              <Tag color="success">Approved</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="From">
            {moment(selectedOvertimes.fromTime, ["HH:mm"]).format("HH:mm A")}
          </Descriptions.Item>
          <Descriptions.Item label="To">
            {moment(selectedOvertimes.toTime, ["HH:mm"]).format("HH:mm A")}
          </Descriptions.Item>
          <Descriptions.Item></Descriptions.Item>
          <Descriptions.Item label="Description">
            {selectedOvertimes.description}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
