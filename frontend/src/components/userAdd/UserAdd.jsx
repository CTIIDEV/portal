import { useContext, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Button, Form, Input, message, Select } from "antd";

import { UserContext } from "../../context/UserContext";

import "./userAdd.css";

export const UserAdd = () => {
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

  const handleRegister = async (data) => {
    await axiosJWT
      .post("http://localhost:5050/api/v1/user/create", data, {
        headers: { authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        if (result.status === 200) {
          message.success(result.data.message);
          form.resetFields();
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          message.error(
            "[" +
              error.response.status +
              "] - " +
              error.response.data.error.name +
              " | " +
              error.response.data.message
          );
        }
      });
  };

  return (
    <div className="userAdd">
      <div className="componentContainer">
        <span className="componentTitle">Add new Employee</span>
      </div>
      <Form
        className="userRegForm"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={(data) => handleRegister(data)}
      >
        <Form.Item
          className="formItem"
          label="ID"
          name="userId"
          rules={[{ required: true, message: "Please input ID" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="First Name"
          name="userFirstName"
          rules={[{ required: true, message: "Please input First Name" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Last Name"
          name="userLastName"
          rules={[{ required: true, message: "Please input Last Name" }]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Department"
          name="userDept"
          rules={[{ required: true, message: "Please select Department" }]}
        >
          <Select placeholder="Select a Department">
            <Option value="Finance & Accounting">Finance & Accounting</Option>
            <Option value="Legal & Compliance">Legal & Compliance</Option>
            <Option value="Risk & Management">Risk & Management</Option>
            <Option value="Claim">Claim</Option>
            <Option value="Reinsurance">Reinsurance</Option>
            <Option value="Underwriting">Underwriting</Option>
            <Option value="China Biz">China Biz</Option>
            <Option value="PPU">PPU</Option>
            <Option value="HR & Admin">Human Resource & Admin</Option>
            <Option value="IT">IT</Option>
            <Option value="Marketing Rep Office">Marketing Rep Offices</Option>
            <Option value="Agent A">Agent A</Option>
            <Option value="Agent B">Agent B</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Email"
          name="userEmail"
          rules={[{ required: true, message: "Please input Email" }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Role"
          name="userRole"
          rules={[{ required: true, message: "Please select Role" }]}
        >
          <Select name="role" placeholder="Select a Role">
            <Option value="Admin">Admin</Option>
            <Option value="Moderator">Moderator</Option>
            <Option value="User">User</Option>
          </Select>
        </Form.Item>
        <Form.Item className="formItem" wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit">
            Register User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
