/* eslint-disable import/first */
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthContextProvider } from "./Firebase/context";
import Root from "./components/Root/Root";
import ProtectRoute from "./components/ProtectRoute/ProtectRoute";
import Tareas from "./Tareas/Tareas";
import Login from "./Login/Login";
import Registro from "./Login/registro";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Root>
          <Switch>
            <ProtectRoute type="public" exact path="/" component={Login} />
            <ProtectRoute type="public" exact path="/registro" component={Registro} />
            <ProtectRoute type="private" exact path="/tareas" component={Tareas} />
          </Switch>
        </Root>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
