import { ManageSupportTicketsTable } from "../../components/manageSupportTicketsTable/ManageSupportTickets";

import "./manageSupportTickets.css";

export const ManageSupportTickets = () => {
  return (
    <div className="manageSupportTickets page">
      <div className="pageTitleContainer">
        <span className="pageTitle">Manage Support Tickets</span>
      </div>
      <div className="manageSupportTicketsContainer">
        <ManageSupportTicketsTable />
      </div>
    </div>
  );
};
