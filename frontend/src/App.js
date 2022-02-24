import { useContext, useEffect } from "react";
import jwt from "jwt-decode";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { Layout, message } from "antd";

import { PrivateRoute } from "./pages/PrivateRoute/PrivateRoute";

import { Profile } from "./pages/profile/Profile";
import { Home } from "./pages/home/Home";
import { User } from "./pages/user/User";
import { UserReg } from "./pages/userReg/UserReg";
import { Leave } from "./pages/leaves/Leave";
import { Overtime } from "./pages/overtimes/Overtime";
import { Report } from "./pages/report/Report";
import { Login } from "./pages/login/Login";
import { LeaveReq } from "./components/leaveReq/LeaveReq";
import { OvertimeReq } from "./components/overtimeReq/OvertimeReq";

import { LayoutHeader } from "./components/layoutHeader/LayoutHeader";
import { LayoutSider } from "./components/layoutSider/LayoutSider";
import { LayoutFooter } from "./components/layoutFooter/LayoutFooter";

import { UserContext } from "./context/UserContext";

import "antd/dist/antd.css";
import "./App.css";
import { Appraisal } from "./pages/appraisal/Appraisal";

function App() {
  const [user, setUser] = useContext(UserContext);
  const { Content } = Layout;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const accessToken = jwt(localStorage.getItem("token"));
      if (accessToken) {
        const expireTime = (accessToken.exp - accessToken.iat) * 1000;
        setTimeout(() => {
          message.warning("Token has expired. Please login again");
          setUser(null);
          localStorage.clear();
        }, expireTime);
      }
    }
  });

  return (
    <Router>
      <Layout className="container">
        {user && <LayoutSider />}
        <Route exact path="/login" component={Login} />
        <Layout className="container__content">
          {user && <LayoutHeader />}
          <Content>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/appraisal" component={Appraisal} />
            <PrivateRoute exact path="/user" component={User} />
            <PrivateRoute exact path="/user-register" component={UserReg} />
            <PrivateRoute exact path="/leave-request" component={LeaveReq} />
            <PrivateRoute exact path="/leave-manage" component={Leave} />
            <PrivateRoute
              exact
              path="/overtime-request"
              component={OvertimeReq}
            />
            <PrivateRoute exact path="/overtime-manage" component={Overtime} />
            <PrivateRoute exact path="/report" component={Report} />
            <PrivateRoute exact path="/profile" component={Profile} />
          </Content>
          {user && <LayoutFooter />}
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
