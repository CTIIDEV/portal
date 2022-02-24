import { useContext, useState } from "react";
import axios from "axios";
import { Button, Form, Input, message } from "antd";
import { Redirect } from "react-router-dom";

import { UserContext } from "../../context/UserContext";

import "./login.css";

export const Login = () => {
  const [, setUser] = useContext(UserContext);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [form] = Form.useForm();

  const handleLogin = async (data) => {
    await axios
      .post("http://localhost:5050/api/v1/user/login", data)
      .then((result) => {
        if (result.status === 200) {
          const { accessToken } = result.data;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(result.data));
          setUser(result.data);
          setLoggedIn(true);
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

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-page">
      <div className="login-page__login-container">
        <div className="login-container__login-header">
          <h3>LOGIN</h3>
          <p>Please enter your credentials to login.</p>
        </div>
        <Form
          className="login-container__login-form"
          layout="vertical"
          form={form}
          onFinish={(data) => handleLogin(data)}
        >
          <Form.Item
            className="login-form__form-item"
            name="email"
            rules={[{ required: true, message: "Please input Email!" }]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item
            className="login-form__form-item"
            name="password"
            rules={[{ required: true, message: "Please input Password!" }]}
          >
            <Input.Password placeholder="Password" visibilityToggle={true} />
          </Form.Item>
          <Form.Item className="login-form__form-item">
            <Button
              className="form-item__login"
              type="primary"
              htmlType="submit"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
