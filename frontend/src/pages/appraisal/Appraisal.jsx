import { useContext, useState } from "react";
import moment from "moment";
import { Col, DatePicker, Form, Input, InputNumber, Row, Table } from "antd";

import { UserContext } from "../../context/UserContext";

export const Appraisal = () => {
  const [user, setUser] = useContext(UserContext);
  const [date, setDate] = useState(moment());
  const [form] = Form.useForm();

  return (
    <div className="appraisal page">
      <div className="pageTitleContainer" style={{ textAlign: "center" }}>
        <h2 className="pageTitle">
          {date.month() <= 5 ? "1st" : "2nd"} SMT PERFORMANCE APPRAISAL FORM YR{" "}
          {date.format("YYYY")} <br />
          FOR HEAD OF UNIT, DEPT & REP OFFICE
        </h2>
      </div>
      <div className="appraisalTableContainer">
        <Row>
          <Col
            xs={0}
            sm={0}
            md={0}
            lg={4}
            xl={4}
            style={{ background: "lightgreen" }}
          >
            COL
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}text
            lg={16}
            xl={16}
            // style={{ background: "green" }}
          >
            <Form
              className="appraisalForm"
              form={form}
              // wrapperCol={{
              //   xs: { span: 24 },
              //   sm: { span: 24 },
              //   md: { span: 20 },
              //   lg: { span: 20 },
              //   xl: { span: 20 },
              // }}
              layout="vertical"
              initialValues={{
                name: user.userFirstName + " " + user.userLastName,
                department: user.userDept,
              }}
              onFinish={(values) => console.log(values)}
            >
              <Form.Item
                className="formItem"
                label="Major accomplishment/achievement (e.q work completes, contribution)"
                name="appAccomplishment"
              >
                <Input.TextArea rows={5} />
              </Form.Item>
              <Form.Item
                className="formItem"
                label="Difficulties or problems in your job, if any (e.q. working relationship with your colleagues/superior, work load, job knowledge, etc)"
                name="appPerformance"
              >
                <Input.TextArea rows={5} />
              </Form.Item>
              <Form.Item
                className="formItem"
                label="How do you wish your department/company to help you so that your work could be better ?"
                name="appPerformance"
              >
                <Input.TextArea rows={5} />
              </Form.Item>
              <h2>Performance Evaluation (to be completed by assessment)</h2>
              <Col>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Appraisal Factor
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    Appraisal Content
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    1st Asst
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    2nd Asst
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    3rd Asst
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    HR Asst
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    Final Score
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Competence (70%)
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Work achievement & Quality of Work (10%)</b>
                    <br />
                    Ability to achieve remarkable performance results,
                    performing effectively and efficiently both under normal
                    circumstances and stress, established and promotes effective
                    work procedures & risk management, establishes and attains
                    realistic goals, prioritized and organized.
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Competence (70%)
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Job knowledge & Application (10%)</b>
                    <br />
                    Possesses relevant job knowledge, applies effectively and
                    efficiently, acts with objectivity and foresight, shows good
                    judgement skills; makes decision in a timely and appropriate
                    manner.
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Competence (70%)
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Leadership Effectiveness (10%)</b>
                    <br />
                    Ability to supervise, delegate, motivate, develop and lead
                    others to meet departmental targets through them.
                    Plan/implement programs for staff development and maintain
                    staff discipline, harmony and morale. Encorages staff to
                    perform their maximum ability. Willing to guide, feedback
                    and training for professional growth of others.
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Competence (70%)
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Planning & Organization (10%)</b>
                    <br />
                    Ability to establish priorities and work schedules. Maximize
                    use of available resources effectively and efficiently.
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Competence (70%)
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Work Attitude (10%)</b>
                    <br />
                    Takes the initiative and proactive in completing work
                    assignments. Keeness to learn, maintain time keeping.
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Competence (70%)
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Work Discipline (10%)</b>
                    <br />
                    Observes the company's regulations and keep good attendance
                    record, self disciplined, neat with proper attire which in
                    line with the staff dress code, adheres strictly to business
                    and operational procedures, prevent company data and keep
                    good company image.
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                {/* === */}
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}></Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Customer Relations (10%)</b>
                    <br />
                    Ability to develop and improve customer service efficiently,
                    ability to promote and create a positive impression to
                    internal/external customer and deal with customer in a
                    tactful and constructive manner.
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                    Interpersonal Relationship (30%)
                  </Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Teamwork and Cooperation (10%)</b>
                    <br />
                    Ability to work in co-operatively, harmony and maintain good
                    working relationships with superior, peers and colleagues.
                    Volunteering to help and guide others when needs, appreciate
                    other person, take attention department unite and spirit of
                    coordination, demonstrates to changes and try new options;
                    monitors and evaluates impact of changes in market place,
                    business environment & government legislation
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} sm={4} md={4} lg={4} xl={4}></Col>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <b>Communication (Oral & Written) (10%)</b>
                    <br />
                    Ability to communicate ideas, thoughts, information &
                    instruction clearly, logically & coherently, ability to
                    listen attentively to customers'/colleagues problems, treat
                    all people with respect, empathy & consistency. Works with
                    other, deals with others honestly & fairly, demonstrate &
                    maintains a positive attitude & a sense of humor, provides
                    constructive feedback
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                    <InputNumber min={1} max={100} />
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                    <InputNumber min={1} max={100} />
                  </Col>
                </Row>
              </Col>
            </Form>
          </Col>
          <Col
            xs={0}
            sm={0}
            md={0}
            lg={4}
            xl={4}
            style={{ background: "lightgreen" }}
          >
            COL
          </Col>
        </Row>
      </div>
    </div>
  );
};
