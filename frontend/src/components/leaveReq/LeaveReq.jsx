import { useContext, useState } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { UserContext } from "../../context/UserContext";

import "./leaveReq.css";
import { suppressDeprecationWarnings } from "moment";

export const LeaveReq = ({ updateRefresh }) => {
  const [user, setUser] = useContext(UserContext);
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [img, setImg] = useState("");
  const [fileList, setFileList] = useState([]);

  const { RangePicker } = DatePicker;

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

  const handleUpload = async ({ fileList }) => {
    if (fileList) {
      const file = fileList[0].originFileObj;
      const base64 = await convertBase64(file);
      // console.log("B64", base64);
      setImg(base64);
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // const convertImg = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       resolve(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   });

  // const handleUpload = async ({ fileList }) => {
  //   if (fileList) {
  //     console.log("IMG", fileList[0].originFileObj);
  //     // let convert = convertImg(fileList[0].originFileObj);
  //     let convert = fileList[0].originFileObj.blob();
  //     setImg(convert);
  //     return convert;
  //   } else {
  //     setImg("");
  //   }
  // };

  const handleSubmit = async (data) => {
    const { leaveDates, leaveDesc, leaveImage } = data;
    // console.log(leaveImage.fileList[0].originFileObj);
    // const base64 = handleUpload(leaveImage).then((result) => {
    //   return result;
    // });
    console.log(img);
    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/leave/create",
        {
          leaveBegin: leaveDates[0],
          leaveEnds: leaveDates[1],
          leaveDesc: leaveDesc,
          leaveImage: img,
          leaveStatus: "processing",
          userId: user.userId,
        },
        { headers: { authorization: "Bearer " + user.accessToken } }
      )
      .then((result) => {
        if (result.status === 200) {
          message.success(result.data.message);
          form.resetFields();
          updateRefresh(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          message.error(
            "[" + error.response.status + "] - " + error.response.data.message
          );
        }
      });
  };

  return (
    <div className="leave-request-page">
      <div className="leave-request-page__leave-request-container">
        <div className="leave-request-container__form">
          <h3>Leave Request Form</h3>
          <h5>Fill the form to request leave.</h5>
          <Form
            className="form__form"
            layout="vertical"
            form={form}
            onFinish={(data) => handleSubmit(data)}
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
            <Form.Item
              className="formItem"
              label="Permission Dates"
              name="leaveDates"
              rules={[{ required: true, message: "Please select Dates!" }]}
            >
              <RangePicker />
            </Form.Item>
            <Form.Item
              className="formItem"
              label="Reason"
              name="leaveDesc"
              rules={[{ required: true, message: "Please input Reason!" }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              className="formItem"
              label="Image"
              name="leaveImage"
              help="Upload image if you think you need to."
            >
              <Upload
                className="section-upload__upload"
                name="file"
                maxCount={1}
                multiple={false}
                progress={{
                  strokeColor: {
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  },
                }}
                onChange={handleUpload}
                beforeUpload={() => false}
              >
                <Button
                  className="section-upload__upload__button"
                  type="primary"
                  icon={<UploadOutlined />}
                >
                  Upload
                </Button>
              </Upload>
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
