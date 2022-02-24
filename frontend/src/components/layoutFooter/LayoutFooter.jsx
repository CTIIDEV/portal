import { useState } from "react";
import moment from "moment";
import { Layout } from "antd";

import "./layoutFooter.css";

export const LayoutFooter = () => {
  const [year, setYear] = useState(moment());
  const { Footer } = Layout;

  return (
    <Footer className="layout-footer">
      <div className="layout-footer__content">
        Employee Portal ©{year.format("YYYY")} Build with Ant UED by CTII IT
        Department
      </div>
    </Footer>
  );
};
