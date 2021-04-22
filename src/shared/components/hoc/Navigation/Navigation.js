import { useContext } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useHistory } from "react-router-dom";

import Button from "../../UI/Button/Button";
import classes from "./Navigation.module.scss";

const Navigation = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const nieuwEventClickedHandler = () => {
    console.log(auth.vereniging);
    history.push("/" + auth.vereniging + "/nieuw-event");
  };

  return (
    <nav className={classes.nav}>
      <Button small btnType={"link"} clicked={auth.logout}>
        Uitloggen
      </Button>
      {auth.admin && (
        <Button small btnType={"link"} clicked={nieuwEventClickedHandler}>
          Nieuw event
        </Button>
      )}
    </nav>
  );
};

export default Navigation;
