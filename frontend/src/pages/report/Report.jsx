import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { ExcelRenderer } from "react-excel-renderer";
import { Table, Upload, message, Button } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

import { UserContext } from "../../context/UserContext";

import "./report.css";

export const Report = () => {
  const [user, setUser] = useContext(UserContext);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [report, setReport] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const { Column } = Table;
  const { Dragger } = Upload;

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("http://localhost:5050/api/v1/report/get-reports")
        .then((result) => {
          const tableData = result.data;
          if (result.data.length === 0) {
            message.error("No data found. Please upload data.");
            return false;
          } else {
            const result = Object.values(
              tableData.reduce((a, { userId, userName, ...prod }) => {
                (
                  a[userId] ||
                  (a[userId] = { userId, userName, production: [] })
                ).production.push(prod);
                return a;
              }, {})
            );
            setData(result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
    setRefresh(false);
  }, [refresh]);

  const fileHandler = (fileList) => {
    let fileObj = fileList;

    if (!fileObj) {
      message.error("No file uploaded!");
      return false;
    }

    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      message.error("Unknown file format. Only Excel files are uploaded!");
    }

    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let extract = [];
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            extract.push({
              userId: row[0],
              userName: row[1],
              reportProductClass: row[2],
              reportYearPrev: row[3],
              reportYearCurr: row[4],
            });
          }
        });

        if (extract.length === 0) {
          message.error("No data found in file!");
          return false;
        } else {
          axios
            .post("http://localhost:5050/api/v1/report/upload", extract, {
              headers: { authorization: "Bearer " + user.accessToken },
            })
            .then((result) => {
              if (result.data) {
                message.success(result.data.message);
                setRefresh(true);
              }
            })
            .catch((error) => {
              if (error.response) {
                message.error(
                  "[" +
                    error.response.status +
                    "] - " +
                    error.response.data.message
                );
              }
            });
        }
      }
    });
    return false;
  };

  const handleDownload = (id) => {
    axios
      .get(`http://localhost:5050/api/v1/report/get-report/${id}`)
      .then((result) => {
        setReport({
          id: result.data[0].userId,
          name: result.data[0].userName,
          prod: result.data,
        });
      })
      .then(() => {
        console.log(report);
        axios
          .post("http://localhost:5050/api/v1/report/create-report", report)
          .then(() =>
            axios.get("http://localhost:5050/api/v1/report/download-report", {
              responseType: "blob",
            })
          )
          .then((res) => {
            const pdfBlob = new Blob([res.data], { type: "application/pdf" });
            saveAs(pdfBlob, "_" + report.id + ".pdf");
            setReport([]);
          });
      })
      .catch((error) => {
        if (error.response) {
          message.error(
            "[" + error.response.status + "] - " + error.response.data.message
          );
        }
      });
  };

  const handleDelete = () => {
    axios
      .delete("http://localhost:5050/api/v1/report/delete-reports")
      .then((result) => {
        console.log(result);
        setRefresh(true);
        if (result.status === 200) {
          message.success(result.data.message);
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

  return (
    <div className="report-page">
      <div className="report-page__report-container">
        <div className="report-container__upload">
          <div className="upload__delete">
            <Button type="primary" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </div>
          <Dragger
            name="file"
            maxCount={1}
            multiple={false}
            beforeUpload={fileHandler}
            onRemove={() => setRows([])}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
          {/* <Upload
            className="section-upload__upload"
            name="file"
            maxCount={1}
            multiple={false}
            progress={{
              strokeColor: {
                "0%": "#108ee9",
                "100%": "#87d068",
              },
              strokeWidth: 3,
              format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
            }}
            beforeUpload={fileHandler}
            onRemove={() => setRows([])}
          >
            <Button
              className="section-upload__upload__button"
              type="primary"
              icon={<UploadOutlined />}
            >
              Upload
            </Button>
          </Upload> */}
        </div>
        <div className="report-container__list">
          <Table dataSource={data}>
            <Column title="ID" dataIndex="userId" />
            <Column title="Name" dataIndex="userName" />
            <Column
              title="Action"
              key="action"
              render={(text, record) => (
                <Button
                  type="primary"
                  onClick={() => handleDownload(record.userId)}
                >
                  Download Report
                </Button>
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  );
};
