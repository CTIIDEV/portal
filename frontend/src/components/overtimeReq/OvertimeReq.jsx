import { useContext } from "react";
import axios from "axios";
import moment from "moment";
import jwt from "jwt-decode";
import { Button, DatePicker, message, TimePicker, Form, Input } from "antd";

import { UserContext } from "../../context/UserContext";

import "./overtimeReq.css";

export const OvertimeReq = ({ updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [form] = Form.useForm();

  const formatTime = "HH:mm";
  const formatDate = "DD/MM/YYYY";

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

  const handleSubmit = async (values) => {
    const { overtimeDateReq, overtimeBegin, overtimeEnds, overtimeDesc } =
      values;

    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/overtime/create",
        {
          overtimeDateReq: overtimeDateReq,
          overtimeBegin: overtimeBegin.format(formatTime),
          overtimeEnds: overtimeEnds.format(formatTime),
          overtimeDesc: overtimeDesc,
          overtimeStatus: "processing",
          userId: user.userId,
        },
        { headers: { Authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        if (result.data) {
          message.success(result.data.message);
        }
        form.resetFields();
        updateRefresh(true);
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
    <div className="overtime-request-page">
      <div className="overtime-request-page__overtime-request-container">
        <div className="leave-request-container__form">
          <h3>Overtime Request Form</h3>
          <h5>Fill the form to request overtime.</h5>
          <Form
            className="form__form"
            layout="vertical"
            form={form}
            initialValues={{
              dateRequest: moment(),
              fromTime: moment(),
            }}
            onFinish={(values) => handleSubmit(values)}
          >
            <div className="form__form-readOnly">
              <Form.Item className="form-readOnly__formItem" label="Name">
                <Input
                  value={user.userFirstName + " " + user.userLastName}
                  readOnly
                />
              </Form.Item>
              <Form.Item className="form-readOnly__formItem" label="Department">
                <Input value={user.userDept} readOnly />
              </Form.Item>
            </div>
            <div className="form__form-items">
              <Form.Item
                className="form-items__formItem"
                label="Request Date"
                name="overtimeDateReq"
              >
                <DatePicker format={formatDate} />
              </Form.Item>
              <Form.Item
                className="form-items__formItem"
                label="Begin"
                name="overtimeBegin"
              >
                <TimePicker format={formatTime} />
              </Form.Item>
              <Form.Item
                className="form-items__formItem"
                label="Ends"
                // name="overtimeEnds"
                rules={[{ required: true, message: "Please select end time." }]}
              >
                <TimePicker format={formatTime} />
              </Form.Item>
            </div>
            <Form.Item
              className="formItem"
              label="Description"
              name="overtimeDesc"
              rules={[{ required: true, message: "Please add description." }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item className="formItem">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="leave-request-container__form"></div>
      </div>
    </div>
  );
};
