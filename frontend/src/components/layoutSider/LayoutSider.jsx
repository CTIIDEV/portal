import { useContext } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Link } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import {
  CarryOutOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  HomeOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { UserContext } from "../../context/UserContext";

import "./layoutSider.css";
import logo from "../../assets/images/tp_90_logo.png";

export const LayoutSider = () => {
  const [user, setUser] = useContext(UserContext);
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  return (
    <Sider className="layout-sider">
      <div className="layout-sider__logo">
        <img src={logo} class="tp_90_logo" alt="logo" />
      </div>
      <Menu
        className="layout-sider__menu"
        mode="inline"
        defaultSelectedKeys={["home"]}
        theme="light"
      >
        <Menu.Item
          className="menu__menu-item"
          key="home"
          icon={<HomeOutlined />}
        >
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item
          className="menu__menu-item"
          key="profile-view"
          icon={<UserOutlined />}
        >
          <Link to="/profile">View Profile</Link>
        </Menu.Item>
        {user.userDept == "HR & Admin" && (
          <SubMenu
            className="menu__menu-submenu"
            title="Employee"
            icon={<TeamOutlined />}
          >
            <Menu.Item className="menu__menu-item" key="employee-view">
              <Link to="/user">View Employees</Link>
            </Menu.Item>
            <Menu.Item className="menu__menu-item" key="employee-add">
              <Link to="/user-register">Add Employee</Link>
            </Menu.Item>
          </SubMenu>
        )}
        {/* 
        {(user.userDept == "Agent A" && user.userRole == "User") ||
        (user.userDept == "Agent B" && user.userRole === "User") ? (
          <> </>
        ) : (
          <SubMenu
            className="menu__menu-submenu"
            title="Leave"
            icon={<CarryOutOutlined />}
          >
            {user.userDept == "HR & Admin" && (
              <Menu.Item className="menu__menu-item" key="leave-manage">
                <Link to="/leave-manage">Manage Leave</Link>
              </Menu.Item>
            )}
            <Menu.Item className="menu__menu-item" key="leave-request">
              <Link to="/leave-request">Request Leave</Link>
            </Menu.Item>
          </SubMenu>
        )}
        {(user.userDept == "Agent A" && user.userRole == "User") ||
        (user.userDept == "Agent B" && user.userRole === "User") ? (
          <> </>
        ) : (
          <SubMenu
            className="menu__menu-submenu"
            title="Overtime"
            icon={<ClockCircleOutlined />}
          >
            {user.userDept == "HR & Admin" && (
              <Menu.Item className="menu__menu-item" key="overtime-manage">
                <Link to="/overtime-manage">Manage Overtime</Link>
              </Menu.Item>
            )}
            <Menu.Item className="menu__menu-item" key="overtime-request">
              <Link to="/overtime-request">Request Overtime</Link>
            </Menu.Item>
          </SubMenu>
        )}
        {user.userDept == "IT" && (
          <SubMenu
            className="menu__menu-submenu"
            title="Report"
            icon={<FileTextOutlined />}
          >
            <Menu.Item className="menu__menu-item" key="report-upload">
              <Link to="/report">Upload Reports</Link>
            </Menu.Item>
          </SubMenu>
        )} */}
        <Menu.Item
          className="menu__menu-item"
          key="appraisal"
          icon={<StarOutlined />}
        >
          <Link to="/appraisal">Appraisal</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
