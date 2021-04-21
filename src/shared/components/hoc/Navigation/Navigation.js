import { useContext } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useHistory, useParams } from "react-router-dom";

import Button from "../../UI/Button/Button";
import classes from "./Navigation.module.scss";

const Navigation = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const params = useParams();

  const nieuwEventClickedHandler = () => {
    history.push("/" + params.verenigingNaam + "nieuw-event");
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
