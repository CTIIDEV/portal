import { Collapse, Space } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import "./userDescription.css";

export const UserDescription = () => {
  const { Panel } = Collapse;

  return (
    <div className="userDescription">
      <div className="componentContainer">
        <span className="componentTitle">About</span>
      </div>
      <Space className="spaceDescription" direction="vertical">
        <Collapse
          className="collapseDescription"
          defaultActiveKey={["1"]}
          accordion
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Panel header="What can you do?" key="1">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              temporibus expedita consectetur, ex, eaque ab rem voluptatum
              maxime cum laborum similique, necessitatibus fuga recusandae ut
              aperiam odio in at totam?
            </p>
          </Panel>
          <Panel header="Roles and Authorization" key="2">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              at minus mollitia voluptatem delectus quam repudiandae impedit
              libero maxime laudantium itaque iste numquam possimus eius, error
              soluta et, accusamus sapiente! <br /> <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              placeat, praesentium fugit, atque eos modi nulla illo odio
              reiciendis maxime minima magnam saepe.
            </p>
          </Panel>
        </Collapse>
      </Space>
    </div>
  );
};
