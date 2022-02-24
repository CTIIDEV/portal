import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { UserContext } from "../../context/UserContext";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user] = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
