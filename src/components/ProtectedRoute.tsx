import React, { ComponentType } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface ProtectedRouteProps extends RouteProps {
  redirect: string;
  component: ComponentType<RouteProps>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  redirect,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: redirect,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};

const UnprotectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  redirect,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: redirect,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
export { UnprotectedRoute };
