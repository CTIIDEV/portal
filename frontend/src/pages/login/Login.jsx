import { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input, message, Typography } from "antd";

import { UserContext } from "../../context/UserContext";

import backgroundLogin from "../../assets/images/background-login.png";
import logo from "../../assets/images/cntaiping-logo.png";

// import "./login.css";

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
    <div
      className="login-page"
      style={{
        background: "linear-gradient(to right, #6a606d 50%,#5e5e69 100%)",
      }}
    >
      <div
        className="login-page__login-container"
        style={{
          backgroundImage: `url(${backgroundLogin})`,
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "101%",
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        <div
          className="login-container"
          style={{
            background: "#b6adb9b0",
            padding: "40px",
            width: "500px",
            position: "absolute",
            top: "50%",
            right: "20%",
            transform: "translate(0%, -50%)",
          }}
        >
          <div
            className="login-container__login-header"
            style={{ textAlign: "center" }}
          >
            <img src={logo} style={{ width: "200px", marginBottom: "20px" }} />
            <Typography.Title
              level={3}
              style={{ color: "#fff", marginBottom: "20px" }}
            >
              Taiping Indonesia Portal System
            </Typography.Title>
          </div>
          <Form
            className="login-container__login-form"
            form={form}
            layout="vertical"
            onSubmit={(event) => event.preventDefault()}
            onFinish={(data) => handleLogin(data)}
            style={{ padding: "0 40px" }}
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
            <Form.Item
              className="login-form__form-item"
              style={{ marginBottom: "0" }}
            >
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
    </div>
  );
};
