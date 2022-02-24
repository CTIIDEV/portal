import { useContext, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jwt from "jwt-decode";
import { Button, message } from "antd";

import { UserContext } from "../../context/UserContext";

import "./profileReport.css";

export const ProfileReport = ({}) => {
  const [user, setUser] = useContext(UserContext);
  const [report, setReport] = useState([]);

  const handleDownload = () => {
    console.log(user);
    axios
      .get(`http://localhost:5050/api/v1/report/get-report/${user.userId}`)
      .then((result) => {
        setReport({
          id: result.data[0].userId,
          name: result.data[0].userName,
          prod: result.data,
        });
      })
      .then(() => {
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
  return (
    <div className="tabs-report">
      <Button
        className="report-button__download"
        type="primary"
        onClick={() => handleDownload()}
      >
        Download Report
      </Button>
    </div>
  );
};
