import React from "react";
import { watchUserChanges } from "./watcher";

//Crear el context
export const AuthContext = React.createContext({});

//Crear el consumer
export const AuthContextConsumer = AuthContext.Consumer;

// Clase para exportar el Provider
export class AuthContextProvider extends React.Component {
  state = {
    isLoggedIn: false,
    authReady: false,
    user: null,
  };

  componentDidMount() {
    this.userWatcherUnsub = watchUserChanges((user) => {
      if (user) {
        sessionStorage.setItem("email", user.email);
        this.setState({
          authReady: true,
          isLoggedIn: true,
          user,
        });
      } else {
        this.setState({
          authReady: true,
          isLoggedIn: false,
          user: null,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.userWatcherUnsub) {
      this.userWatcherUnsub();
    }
  }

  render() {
    const { children } = this.props;

    return (
      <AuthContext.Provider
        value={{
          ...this.state,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}
