import { useContext, useState } from "react";
import { Avatar, Descriptions, Tabs, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { ProfileDisplay } from "../../components/profileDisplay/ProfileDisplay";
import { ProfileReport } from "../../components/profileReport/ProfileReport";
import { ProfileSettings } from "../../components/profileSettings/ProfileSettings";
import { ProfileAsgmtTable } from "../../components/profileAsgmtTable/ProfileAsgmtTable";
import { ProfileTaskTable } from "../../components/profileTaskTable/ProfileTaskTable";
import { ProfileOvertimeTable } from "../../components/profileOvertimeTable/ProfileOvertimeTable";
import { ProfileLeaveTable } from "../../components/profileLeaveTable/ProfileLeaveTable";

import { UserContext } from "../../context/UserContext";

import "./profile.css";

export const Profile = () => {
  const [user, setUser] = useContext(UserContext);
  const [refresh, setRefresh] = useState(false);

  const { TabPane } = Tabs;

  return (
    <div className="profile-page">
      {/* <div className="pageTitleContainer">
        <span className="pageTitle">Profile</span>
      </div>
      <div className="profileWidgets"></div> */}
      {/* <div className="profileContainer">
        <div className="profileContainerLeft">
          <ProfileDisplay refresh={refresh} updateRefresh={setRefresh} />
        </div>
        <div className="profileContainerRight">
          <Tabs className="tabs" defaultActiveKey="overtime">
            <TabPane tab="Overtime" key="overtime">
              <ProfileOvertimeTable />
            </TabPane>
            <TabPane tab="Leave" key="leave">
              <ProfileLeaveTable />
            </TabPane>
            <TabPane tab="Report" key="report">
              <ProfileReport />
            </TabPane>
            <TabPane tab="Settings" key="setting">
              <ProfileSettings updateRefresh={setRefresh} />
            </TabPane>
          </Tabs>
        </div>
      </div> */}
      <div className="profile-page__profile-container">
        <div className="profile-container__information">
          <div className="information-image">
            <Avatar size={96} icon={<UserOutlined />} />
          </div>
          <div className="information-data">
            <Descriptions className="information-data__description">
              <Descriptions.Item label="Name" span={3}>
                {user.userFirstName + " " + user.userLastName}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {user.userRole === "Admin" ? (
                  <Tag color="#f50">Admin</Tag>
                ) : user.userRole === "Moderator" ? (
                  <Tag color="#87d068">Moderator</Tag>
                ) : (
                  <Tag color="#2db7f5">User</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Department" span={2}>
                {user.userDept}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {user.userEmail}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <div className="profile-container__activities">
          <Tabs className="activities-tabs">
            {(user.userDept == "Agent A" && user.userRole == "User") ||
            (user.userDept == "Agent B" && user.userRole === "User") ? (
              <> </>
            ) : (
              <>
                <TabPane tab="Overtime" key="overtime">
                  <ProfileOvertimeTable />
                </TabPane>
                <TabPane tab="Leave" key="leave">
                  <ProfileLeaveTable />
                </TabPane>
              </>
            )}
            {(user.userDept == "Agent A" && user.userRole == "User") ||
            (user.userDept == "Agent B" && user.userRole === "User") ? (
              <TabPane tab="Report" key="report">
                <ProfileReport />
              </TabPane>
            ) : (
              <> </>
            )}
            <TabPane tab="Settings" key="setting">
              <ProfileSettings updateRefresh={setRefresh} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
