import { useState } from "react";

import { AsgmtAdd } from "../../components/asgmtAdd/AsgmtAdd";
import { AsgmtTable } from "../../components/asgmtTable/AsgmtTable";

import "./assignment.css";

export const Assignment = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="assignment page">
      <div className="pageTitleContainer">
        <span className="pageTitle">Assignment Management</span>
      </div>
      {/* <div className="assingmentWidgets">
        <AsgmtAdd updateRefresh={setRefresh} />
      </div> */}
      <div className="assignmentTableContainer">
        <AsgmtTable refresh={refresh} updateRefresh={setRefresh} />
      </div>
    </div>
  );
};
