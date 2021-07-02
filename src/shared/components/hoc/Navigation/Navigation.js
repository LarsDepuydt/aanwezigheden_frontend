import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { Link, useLocation } from "react-router-dom";

import Button from "../../UI/Button/Button";
import classes from "./Navigation.module.scss";

const Navigation = () => {
  const auth = useContext(AuthContext);
  const history = useLocation();
  const [showNieuwEvent, setShowNieuwEvent] = useState(true);

  useEffect(() => {
    if (history.pathname.slice(-12) === "/nieuw-event") {
      setShowNieuwEvent(false);
    } else {
      setShowNieuwEvent(true);
    }
  }, [history]);

  return (
    <nav className={classes.nav}>
      <ul className={classes.ul}>
        <li className={classes.li}>
          <Button small btnType={"link"} clicked={auth.logout}>
            Uitloggen
          </Button>
        </li>
        {auth.admin && showNieuwEvent && (
          <li className={classes.li}>
            <Link
              className={classes.navItem}
              to={"/" + auth.vereniging + "/nieuw-event"}
            >
              Nieuw event
            </Link>
          </li>
        )}
        {auth.admin && !showNieuwEvent && (
          <li className={classes.li}>
            <Link className={classes.navItem} to={"/" + auth.vereniging}>
              Home
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
