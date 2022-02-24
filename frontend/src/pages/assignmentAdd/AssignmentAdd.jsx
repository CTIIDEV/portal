import { AsgmtAdd } from "../../components/asgmtAdd/AsgmtAdd";

import "./assignmentAdd.css";

export const AssignmentAdd = () => {
  return (
    <div className="assignmentAdd page">
      <div className="pageTitleContainer">
        <span className="pageTitle">Add Assignment</span>
      </div>
      <div className="assignmentAddWidgets">
        <AsgmtAdd />
      </div>
    </div>
  );
};
