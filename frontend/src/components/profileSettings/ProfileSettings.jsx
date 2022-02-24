import { useContext, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Button, Form, Input, List, message, Modal } from "antd";

import { UserContext } from "../../context/UserContext";

import "./profileSettings.css";

export const ProfileSettings = ({ updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [visiblePW, setVisiblePW] = useState(false);
  const [form] = Form.useForm();

  const refreshToken = async () => {
    try {
      const result = await axios.post(
        "http://localhost:5050/api/v1/user/refresh",
        { token: user.refreshToken }
      );
      setUser({
        ...user,
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      });
      return result.data;
    } catch (error) {
      message.error(error.response.data);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleChangePassword = () => {
    setVisiblePW(true);
  };

  const handleClosePW = () => {
    setVisiblePW(false);
    form.resetFields();
  };

  const handleSubmitPW = async (values) => {
    const { oldPassword, newPasswordOne, newPasswordTwo } = values;
    await axiosJWT
      .put(
        `http://localhost:5050/api/v1/user/change-password`,
        { userId: user.userId, oldPassword, newPasswordOne, newPasswordTwo },
        { headers: { authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        if (result.data) {
          message.success(result.data.message);
          setUser("");
          localStorage.clear();
        }
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response) {
          message.error(error.response.data.message);
        }
      });

    // if (newPasswordOne === newPasswordTwo) {
    //   message.info(newPasswordOne + " " + newPasswordTwo);
    // await axiosJWT
    //   .put(
    //     `http://localhost:5050/api/v1/user/change-password`,
    //     { id: user.id, password: newPasswordOne },
    //     { headers: { Authorization: "Bearer " + user.accessToken } }
    //   )
    //   .then((result) => {
    //     alert(result.data.message);
    //   })
    //   .then(() => {
    //     axiosJWT.post(
    //       "http://localhost:5050/api/v1/user/logout",
    //       { token: user.accessToken },
    //       { headers: { Authorization: "Bearer " + user.accessToken } }
    //     );
    //     setUser(null);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // } else {
    //   message.error("Password is not matching.");
    // }
  };

  return (
    <div className="tabs-settings">
      <div className="tabs-settings__settings-container">
        <List>
          <List.Item onClick={handleChangePassword}>
            <a>Change Password</a>
          </List.Item>
        </List>
      </div>
      <Modal
        title="Change Password"
        visible={visiblePW}
        onCancel={handleClosePW}
        footer={null}
      >
        <Form
          className="changePasswordForm"
          layout="vertical"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={(values) => handleSubmitPW(values)}
        >
          <Form.Item
            className="formItem"
            label="Old Password"
            name="oldPassword"
            rules={[{ required: true, message: "Please input old password" }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            className="formItem"
            label="New Password"
            name="newPasswordOne"
            rules={[{ required: true, message: "Please input new password" }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            className="formItem"
            label="Retype Password"
            name="newPasswordTwo"
            rules={[{ required: true, message: "Please retype new password" }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item className="formItem" wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
