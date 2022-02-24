import { useContext } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { Link } from "react-router-dom";
import {
  CarryOutOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  SnippetsOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";

import { UserContext } from "../../context/UserContext";

import "./sidebar.css";

export const Sidebar = () => {
  const [user, setUser] = useContext(UserContext);

  const { SubMenu } = Menu;

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5050/api/v1/user/refresh",
        { token: user.refreshToken }
      );
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["Authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleLogout = async () => {
    await axiosJWT
      .post(
        "http://localhost:5050/api/v1/user/logout",
        { token: user.refreshToken },
        { headers: { Authorization: "Bearer " + user.accessToken } }
      )
      .then(() => {
        setUser("");
        localStorage.clear();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(user);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        {/* <div className="sidebarLogo">
          <img
            src="https://bankingthefuture.com/wp-content/uploads/2019/04/dummylogo.jpg"
            alt="logo"
            style={{ width: "150px" }}
          />
          <span className="logo"></span>
        </div> */}
        <div className="sidebarMenu">
          <Menu className="menu" mode="inline">
            <Menu.Item icon={<HomeOutlined />}>
              <Link to="/" className="link">
                Home
              </Link>
            </Menu.Item>
            {user.userDept == "HR & Admin" && (
              <SubMenu icon={<TeamOutlined />} title="Employee">
                <Menu.Item className="sidebarSubMenu">
                  <Link to="/users" className="link">
                    View Employees
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/users-register" className="link">
                    Add Employee
                  </Link>
                </Menu.Item>
              </SubMenu>
            )}
            {/* <SubMenu icon={<SnippetsOutlined />} title="Assignment">
              <Menu.Item className="sidebarSubMenu">
                <Link to="/assignments" className="link">
                  View Assignment
                </Link>
              </Menu.Item>
              {user.role == "Admin" || user.role == "Moderator" ? (
                <Menu.Item>
                  <Link to="/assignments-add" className="link">
                    Create Assignment
                  </Link>
                </Menu.Item>
              ) : (
                <></>
              )}
            </SubMenu> */}
            {/* <SubMenu icon={<CommentOutlined />} title="Support Ticket">
              <Menu.Item className="sidebarSubMenu">
                <Link to="/tickets" className="link">
                  Request Support Ticket
                </Link>
              </Menu.Item>
              {user.department == "IT" ? (
                <Menu.Item>
                  <Link to="/manage-tickets" className="link">
                    Manage Support Ticket
                  </Link>
                </Menu.Item>
              ) : (
                <></>
              )}
            </SubMenu> */}
            <SubMenu icon={<CarryOutOutlined />} title="Leave">
              {(user.userDept == "Agent A" && user.userRole == "User") ||
              (user.userDept == "Agent B" && user.userRole === "User") ? (
                <> </>
              ) : (
                <Menu.Item className="sidebarSubMenu">
                  <Link to="/leaves" className="link">
                    Request Leave
                  </Link>
                </Menu.Item>
              )}
              {user.userDept == "HR & Admin" ? (
                <Menu.Item>
                  <Link to="/manage-leaves" className="link">
                    Manage Leave
                  </Link>
                </Menu.Item>
              ) : (
                <></>
              )}
            </SubMenu>
            <SubMenu icon={<ClockCircleOutlined />} title="Overtime">
              <Menu.Item className="sidebarSubMenu">
                <Link to="/overtimes" className="link">
                  Request Overtime
                </Link>
              </Menu.Item>
              {user.userDept == "HR & Admin" ? (
                <Menu.Item>
                  <Link to="/manage-overtimes" className="link">
                    Manage Overtime
                  </Link>
                </Menu.Item>
              ) : (
                <></>
              )}
            </SubMenu>
            {user.userDept == "IT" && (
              <SubMenu icon={<FileTextOutlined />} title="Report">
                <Menu.Item className="sidebarSubMenu">
                  <Link to="/reports-upload" className="link">
                    Upload Reports
                  </Link>
                </Menu.Item>
              </SubMenu>
            )}
            <SubMenu icon={<UserOutlined />} title="Profile">
              <Menu.Item className="sidebarSubMenu">
                <Link to="/profile" className="link">
                  View Profile
                </Link>
              </Menu.Item>
              <Menu.Item>
                <a onClick={handleLogout}>Logout</a>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </div>
  );
};
