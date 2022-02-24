import { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Button, Form, Input, Select, DatePicker } from "antd";

import { UserContext } from "../../context/UserContext";

import "./asgmtAdd.css";

export const AsgmtAdd = ({ updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;
  const { Option } = Select;

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
      await axios
        .get(`http://localhost:5050/api/v1/user/users/${user.department}`)
        .then((result) => {
          setUsers(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    const { title, department, urgency, date, participant, description } =
      values;
    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/assignment/create",
        {
          title,
          department,
          assignmentBegin: date[0].format("DD-MM-YYYY"),
          assignmentEnd: date[1].format("DD-MM-YYYY"),
          description,
          participant,
          urgency,
        },
        { headers: { Authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        console.log(result.data);
        form.resetFields();
        updateRefresh(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="asgmtAdd">
      <div className="componentContainer">
        <span className="componentTitle">Add New Assignment</span>
      </div>
      <Form
        className="asgmtAddForm"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          department: user.department,
        }}
        onFinish={(values) => handleSubmit(values)}
      >
        <Form.Item
          className="formItem"
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input Title!" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Department"
          name="department"
          rules={[{ required: true, message: "Please input Department!" }]}
        >
          <Input type="text" disabled />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Urgency"
          name="urgency"
          rules={[{ required: true, message: "Please select Urgency!" }]}
        >
          <Select name="urgency" placeholder="Select Urgency Level">
            <Option value="high">High</Option>
            <Option value="moderate">Moderate</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Date Range"
          name="date"
          rules={[{ required: true, message: "Please select Dates" }]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Participant"
          name="participant"
          rules={[{ required: true, message: "Please assign User(s)" }]}
        >
          <Select mode="multiple" allowClear>
            {users.map((user) => {
              return (
                <Option key={user.id}>
                  {user.firstName + " " + user.lastName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input Description!" }]}
        >
          <Input.TextArea row={3} />
        </Form.Item>
        <Form.Item className="formItem" wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit">
            Add Assignment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
