import { useContext } from "react";
import { AuthContext } from "../../../hooks/auth-context";

import Button from "../../UI/Button/Button";
import classes from "./Navigation.module.scss";

const Navigation = () => {
  const auth = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <Button small btnType={"link"} clicked={auth.logout}>
        Uitloggen
      </Button>
    </nav>
  );
};

export default Navigation;
