import { Collapse, Space } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import "./supportPolicy.css";

export const SupportPolicy = () => {
  const { Panel } = Collapse;

  return (
    <div className="supportPolicy">
      <div className="componentContainer">
        <span className="componentTitle">Support Policy</span>
      </div>
      <div className="supportPolicyContainer">
        <Space className="spaceSupportPolicy" direction="vertical">
          <Collapse
            className="collapseSupportPolicy"
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
                Voluptate quam maiores dolore, quibusdam adipisci, nemo
                incidunt, libero assumenda aut voluptates excepturi officiis
                saepe possimus optio laboriosam cupiditate ipsa quas natus?
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit
                ad, obcaecati eius beatae at harum culpa placeat dicta tenetur
                iure laboriosam pariatur, qui accusantium aliquid doloribus
                adipisci voluptas eos nobis?
              </p>
            </Panel>
            <Panel
              className=""
              header="Request Support Ticket Procedure"
              key="2"
            >
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Obcaecati ipsa harum tenetur reiciendis. Incidunt nobis,
                adipisci dignissimos dicta obcaecati dolores voluptatem odio
                ratione, laboriosam quos dolorum dolorem ut optio impedit!
                <br />
                <br />
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quas
                voluptatibus sequi earum dolores voluptates, cupiditate eos
                eaque nisi nam facere sapiente dicta quod aliquid officiis ea
                repellat repudiandae? Incidunt, necessitatibus.
              </p>
            </Panel>
          </Collapse>
        </Space>
      </div>
    </div>
  );
};
