import { useState } from "react";

import { SupportPolicy } from "../../components/supportPolicy/SupportPolicy";
import { SupportReq } from "../../components/supportReq/SupportReq";
import { SupportTable } from "../../components/supportTable/SupportTable";

import "./supportTicket.css";

export const SupportTicket = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="supportTicket page">
      <div className="pageTitleContainer">
        <span className="pageTitle">Support Ticket</span>
      </div>
      <div className="supportTicketWidgets">
        <SupportPolicy />
        <SupportReq updateRefresh={setRefresh} />
      </div>
      <div className="supportTicketTableContainer">
        <SupportTable refresh={refresh} updateRefresh={setRefresh} />
      </div>
    </div>
  );
};
