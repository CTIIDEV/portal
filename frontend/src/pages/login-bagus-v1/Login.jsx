import { useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, message } from "antd";

import { UserContext } from "../../context/UserContext";

import "./login.css";

export const Login = () => {
  const [user, setUser, accessToken, setAccessToken] = useContext(UserContext);
  const [form] = Form.useForm();
  let history = useHistory();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    await axios
      .post("http://localhost:5050/api/v1/user/login", { email, password })
      .then((result) => {
        const { accessToken } = result.data;
        localStorage.setItem("user", JSON.stringify(result.data));
        localStorage.setItem("accessToken", accessToken);
        history.push("/");
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
    <div className="login">
      <Form
        className="loginForm"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onFinish={(values) => handleSubmit(values)}
      >
        <div className="loginLogo">
          <span className="logo">Logo</span>
        </div>
        <Form.Item
          className="formItem"
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input Email!" }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          className="formItem"
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input Password!" }]}
        >
          <Input.Password visibilityToggle={false} />
        </Form.Item>
        <Form.Item className="formItem" wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
