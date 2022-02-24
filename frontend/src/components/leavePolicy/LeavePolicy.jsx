import { Collapse, Space } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import "./leavePolicy.css";

export const LeavePolicy = () => {
  const { Panel } = Collapse;

  return (
    <div className="leavePolicy">
      <div className="componentContainer">
        <span className="componentTitle">Leave Policy</span>
      </div>
      <div className="leavePolicyContainer">
        <Space className="spaceLeavePolicy" direction="vertical">
          <Collapse
            className="collapseLeavePolicy"
            defaultActiveKey={["1"]}
            accordion
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel className="" header="Policy" key="1">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Cupiditate nesciunt sapiente facilis possimus iure. Pariatur
                debitis rerum, similique accusantium placeat consectetur
                expedita soluta quas asperiores laudantium voluptatibus ex
                quaerat quae!
              </p>
            </Panel>
            <Panel className="" header="Leave Request Procedure" key="2">
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem
                veniam quam soluta quia doloremque unde molestiae dignissimos
                non minus nostrum voluptatum ratione dolor, maxime et, dolorum
                doloribus. Soluta, officia assumenda!
              </p>
            </Panel>
          </Collapse>
        </Space>
      </div>
    </div>
  );
};
