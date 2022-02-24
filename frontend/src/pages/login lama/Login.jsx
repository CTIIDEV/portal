import { useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Button, Form, Input } from "antd";

import { UserContext } from "../../context/UserContext";

import "./login.css";

export const Login = () => {
  const [user, setUser, accessToken, setAccessToken] = useContext(UserContext);
  const [form] = Form.useForm();
  let history = useHistory();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      await axios
        .post("http://localhost:5050/api/v1/user/login", { email, password })
        .then((result) => {
          const { accessToken } = result.data;
          localStorage.setItem("user", JSON.stringify(result.data));
          localStorage.setItem("accessToken", accessToken);
          // setUser(result.data);
          history.push("/")
        })
        // .then(() => {
        //   const user = localStorage.getItem("user");
        //   const accessToken = localStorage.getItem("accessToken");

        //   if (accessToken && user) {
        //     setUser(JSON.parse(user));
        //     const decoded = jwt(accessToken);
        //     setAccessToken(decoded);
        //   }
        // })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
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
