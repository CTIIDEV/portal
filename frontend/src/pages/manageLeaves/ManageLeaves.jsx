import { ManageLeavesTable } from "../../components/manageLeavesTable/ManageLeavesTable";

import "./manageLeaves.css";

export const ManageLeaves = () => {
  return (
    <div className="manageLeaves page">
      <div className="pageTitleContainer">
        <span className="pageTitle">Manage Leave Requests</span>
      </div>
      <div className="manageLeavesContainer">
        <ManageLeavesTable />
      </div>
    </div>
  );
};
