import { Switch, Route, Redirect } from "react-router-dom";
import { AuthContext } from "./shared/hooks/auth-context";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./shared/hooks/auth-hook";

import NieuweVereniging from "./pages/NieuweVereniging/NieuweVereniging";
import SignInUp from "./pages/SignInUp/SignInUp";
import Main from "./pages/Main/Main";
import NewEvent from "./pages/Admin/NewEvent/NewEvent";
import Navigation from "./shared/components/hoc/Navigation/Navigation";

const App = () => {
  const { token, admin, login, logout, userId, vereniging } = useAuth();

  let routes;
  if (token) {
    if (admin) {
      routes = (
        <Switch>
          <Redirect from="/nieuwe-vereniging" to="/" />
          <Route exact path={"/" + vereniging}>
            <Main />
          </Route>
          <Route exact path={"/" + vereniging + "/nieuw-event"}>
            <NewEvent />
          </Route>
          <Redirect from={"/" + vereniging} to={"/" + vereniging} />
          <Redirect to={"/" + vereniging} />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Redirect from="/nieuwe-vereniging" to="/" />
          <Route exact path={"/" + vereniging}>
            <Main />
          </Route>
          <Redirect from={"/" + vereniging} to={"/" + vereniging} />
          <Redirect to={"/" + vereniging} />
        </Switch>
      );
    }
  } else {
    routes = (
      <Switch>
        <Route exact path="/nieuwe-vereniging">
          <NieuweVereniging />
        </Route>
        <Route path="/:verenigingNaam/inloggen">
          <SignInUp signIn={true} />
        </Route>
        <Route path="/:verenigingNaam/registreren">
          <SignInUp signIn={false} />
        </Route>
        <Redirect from="/:verenigingNaam" to="/:verenigingNaam/inloggen" />
        <Redirect to="/nieuwe-vereniging" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth: !!token,
        userId,
        token: token,
        csrf: "",
        admin: admin,
        vereniging,
        login,
        logout,
      }}
    >
      <Router>
        <header>
          <h1>Aanwezigheden Chiro Skippy</h1>
        </header>
        {token && <Navigation />}
        <main>{routes}</main>
        <footer></footer>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
