import { useContext } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
import { Button, DatePicker, Form, Input, Select } from "antd";

import { UserContext } from "../../context/UserContext";

import "./supportReq.css";

export const SupportReq = ({ updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [form] = Form.useForm();

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

  const handeleSubmit = async (values) => {
    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/ticket/create",
        {
          ...values,
          dateReq: moment(),
          dateSolved: moment(),
          solved: false,
          userId: user.id,
        },
        { headers: { Authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        form.resetFields();
        updateRefresh(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="supportReq">
      <div className="componentContainer">
        <span className="componentTitle">Request Support Ticket</span>
      </div>
      <Form
        className="supportTicketReqForm"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          fullName: user.firstName + " " + user.lastName,
          department: user.department,
        }}
        onFinish={(values) => handeleSubmit(values)}
      >
        <Form.Item className="formItem" label="Name" name="fullName">
          <Input disabled />
        </Form.Item>
        <Form.Item className="formItem" label="Department" name="department">
          <Input disabled />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input Title" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input Description" }]}
        >
          <Input.TextArea type="text" col={3} />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Urgency"
          name="urgency"
          rules={[{ required: true, message: "Please select Urgency" }]}
        >
          <Select name="urgency" placeholde="Select Urgency">
            <Option value="high">High</Option>
            <Option value="moderate">Moderate</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item className="formItem" wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit">
            Request Ticket
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
