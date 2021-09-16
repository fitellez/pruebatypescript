import React from "react";
import { AuthContext } from "../../Firebase/context";

class Root extends React.Component {
  render() {
    const { children } = this.props;
    const { authReady } = this.context;

    if (!authReady) {
      return <div />;
    }

    return children;
  }
}

Root.contextType = AuthContext;

export default Root;
