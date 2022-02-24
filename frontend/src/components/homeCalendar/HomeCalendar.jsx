import { useContext, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
import { Button, Calendar, Form, Input, Modal, Select } from "antd";

import { UserContext } from "../../context/UserContext";

import "./homeCalendar.css";

export const HomeCalendar = ({ updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(moment());
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

  const handleSelect = async (value) => {
    setVisible(true);
    setSelectedMoment(value);
  };

  const handleVisible = () => {
    setVisible(false);
  };

  const handleSubmit = async (values) => {
    // console.log(values);
    console.log(selectedMoment);
    let { title, urgency, description } = values;
    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/task/create",
        {
          title,
          urgency,
          description,
          date: selectedMoment,
          dateOfYear: selectedMoment.dayOfYear(),
          userId: user.id,
          completed: false,
        },
        { headers: { Authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        console.log(result);
        form.resetFields();
        updateRefresh(true);
        setVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home-container__calendar">
      <Calendar fullscreen={false} onSelect={handleSelect} />
      <Modal visible={visible} onCancel={handleVisible} footer={null}>
        <Form
          className="scheduleForm"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => handleSubmit(values)}
        >
          <div className="componentContainer">
            <span className="componentTitle">Add Schedule</span>
          </div>
          <Form.Item
            className="formItem"
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required!" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            className="formItem"
            label="Urgency"
            name="urgency"
            rules={[{ required: true, message: "Urgency is required!" }]}
          >
            <Select name="urgency" placeholder="Select Urgency Level">
              <Option value="high">High</Option>
              <Option value="moderate">Moderate</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item
            className="formItem"
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required!" }]}
          >
            <Input.TextArea type="text" />
          </Form.Item>
          <Form.Item className="formItem" wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Add Schedule
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
