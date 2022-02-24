import { useContext, useEffect } from "react";
import jwt from "jwt-decode";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Profile } from "./pages/profile/Profile";
import { Home } from "./pages/home/Home";
import { User } from "./pages/user/User";
import { UserReg } from "./pages/userReg/UserReg";
import { Assignment } from "./pages/assignment/Assignment";
import { AssignmentAdd } from "./pages/assignmentAdd/AssignmentAdd";
import { Leave } from "./pages/leaves/Leave";
import { ManageLeaves } from "./pages/manageLeaves/ManageLeaves";
import { Overtime } from "./pages/overtimes/Overtime";
import { ManageOvertimes } from "./pages/manageOvertimes/ManageOvertimes";
import { SupportTicket } from "./pages/supportTickets/SupportTicket";
import { ManageSupportTickets } from "./pages/manageSupportTickets/ManageSupportTickets";
import { ReportUpload } from "./pages/reportUpload/ReportUpload";
import { Login } from "./pages/login/Login";

import { Navbar } from "./components/navbar/Navbar";
import { Sidebar } from "./components/sidebar/Sidebar.jsx";
import { Footer } from "./components/footer/Footer";

import { UserContext } from "./context/UserContext";

import "antd/dist/antd.css";
import "./App.css";
import { message } from "antd";

function App() {
  const [user, setUser, accessToken, setAccessToken] = useContext(UserContext);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && user) {
      setUser(JSON.parse(user));
      const decoded = jwt(accessToken);
      setAccessToken(decoded);
    }
    timeout();
  }, []);

  const timeout = () => {
    setTimeout(() => {
      message.info("Token has expired. Please login again.");
      setUser("");
      setAccessToken("");
      localStorage.clear();
    }, 900000);
  };

  return (
    <Router>
      {
        // user ? (
        accessToken && user ? (
          <>
            {/* <Navbar /> */}
            <div className="container">
              <Sidebar />
              <Switch>
                <Route exact path="/profile">
                  <Profile />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/users">
                  <User />
                </Route>
                <Route exact path="/users-register">
                  <UserReg />
                </Route>
                <Route exact path="/assignments">
                  <Assignment />
                </Route>
                <Route exact path="/assignments-add">
                  <AssignmentAdd />
                </Route>
                <Route exact path="/leaves">
                  <Leave />
                </Route>
                <Route exact path="/manage-leaves">
                  <ManageLeaves />
                </Route>
                <Router exact path="/overtimes">
                  <Overtime />
                </Router>
                <Router exact path="/manage-overtimes">
                  <ManageOvertimes />
                </Router>
                <Route exact path="/tickets">
                  <SupportTicket />
                </Route>
                <Route exact path="/manage-tickets">
                  <ManageSupportTickets />
                </Route>
                <Route exact path="/reports-upload">
                  <ReportUpload />
                </Route>
              </Switch>
            </div>
            <Footer />
          </>
        ) : (
          <>
            <Route>
              <Login />
            </Route>
          </>
        )
      }
    </Router>
  );
}

export default App;
