import { ManageOvertimeTables } from "../../components/manageOvertimesTable/ManageOvertimesTables";

import "./manageOvertimes.css";

export const ManageOvertimes = () => {
  return (
    <div className="manageOvertimes page">
      <div className="pageTitleContainer">
        <span className="pageTitle">Manage Overtime</span>
      </div>
      <div className="manageOvertimesContainer">
        <ManageOvertimeTables />
      </div>
    </div>
  )
}