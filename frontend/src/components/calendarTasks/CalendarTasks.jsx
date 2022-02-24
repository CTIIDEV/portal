import { useContext, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import moment from "moment";
import {
  Button,
  Calendar,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";

import { UserContext } from "../../context/UserContext";

import "./calendarTasks.css";

export const CalendarTasks = () => {
  const [user, setUser] = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState(moment());
  const [form] = Form.useForm();

  const { Option } = Select;
  const { Column } = Table;

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

  const handleVisible = () => {
    setVisible(!visible);
    setSelectedMoment("")
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    let { title, description, urgency, date } = values;
    
    try {
      await axiosJWT
        .post(
          "http://localhost:5050/api/v1/task/create",
          {
            title,
            description,
            urgency,
            date: date.format("dddd, MMM Do YYYY"),
            dateOfYear: date.dayOfYear(),
            userId: user.id,
          },
          { headers: { Authorization: "Bearer " + user.accessToken } }
        )
        .then((result) => {
          form.resetFields();
          setVisible(!visible);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = async (value) => {
    console.log("VALUE", value)
    setVisible(!visible);
    setSelectedMoment(value);
    await axiosJWT
      .get(`http://localhost:5050/api/v1/task/view-doy/${value.dayOfYear()}`, {
        headers: { Authorization: "Bearer " + user.accessToken },
      })
      .then((result) => {
        // console.log(result);
        setTasks(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="taskAdd">
      <div className="componentContainer">
        <span className="componentTitle">Calendar and Tasks</span>
      </div>
      <Calendar
        className="calendarTasks"
        fullscreen={false}
        onSelect={handleSelect}
      />
      <Modal visible={visible} onCancel={handleVisible} footer={null}>
        <div className="componentContainer">
          <span className="componentTitle">View Tasks</span>
        </div>
        <Table
          dataSource={tasks}
          pagination={{
            pageSize: 10,
            position: ["none", "bottomRight"],
            simple: true,
          }}
        >
          <Column title="Title" dataIndex="title" key="title" />
          <Column
            title="Urgency"
            dataIndex="urgency"
            key="urgency"
            render={(urgency) => {
              if (urgency === "high") {
                return <Tag color="error">High</Tag>;
              } else if (urgency === "moderate") {
                return <Tag color="warning">Moderate</Tag>;
              } else if (urgency === "low") {
                return <Tag color="success">Low</Tag>;
              }
            }}
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space className="tableActions" size="medium">
                <Button className="actionView" size="small">
                  View
                </Button>
                <Button className="actionDelete" size="small">
                  Delete
                </Button>
              </Space>
            )}
          />
        </Table>
        <Form
          className="taskForm"
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{
            date: selectedMoment,
          }}
          onFinish={(values) => handleSubmit(values)}
        >
          <div className="componentContainer">
            <span className="componentTitle">Add New Task</span>
          </div>
          <Form.Item
            className="formItem"
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is Required!" }]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item className="formItem" label="Deadline" name="date">
            <DatePicker disabled />
          </Form.Item>
          <Form.Item
            className="formItem"
            label="Urgency"
            name="urgency"
            rules={[{ required: true, message: "Urgency is Required!" }]}
          >
            <Select name="urgency" placeholder="Select Urgency Level">
              <Option value="high">High</Option>
              <Option value="moderate">Moderate</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item
            className="formItem"
            label="Details"
            name="description"
            rules={[{ required: true, message: "Description is Required!" }]}
          >
            <Input.TextArea cols={3} />
          </Form.Item>
          <Form.Item className="formItem" wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
