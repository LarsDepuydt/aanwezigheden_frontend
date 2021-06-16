import { useContext, useState } from "react";
import { AuthContext } from "../../../../shared/hooks/auth-context";

import UserBtn from "./UserBtn/UserBtn";
import AdminBtn from "./AdminBtn/AdminBtn";
import EventShow from "../../../Admin/components/EventShow/EventShow";
import Button from "../../../../shared/components/UI/Button/Button";

import classes from "./Card.module.scss";

// 0: aanwezig
// 1: afwezig
// 2: onbepaald

const Card = (props) => {
  const value = props.state;
  const { changeState } = props;
  const auth = useContext(AuthContext);
  const [aanpassen, setAanpassen] = useState(false);

  const changeValueHandler = () => {
    if (value === 1) {
      changeState(0);
    } else if (value === 0) {
      changeState(1);
    }
  };

  const eventUpdatedHandler = (newValues) => {
    props.eventUpdated(newValues);
    setAanpassen(false);
  };

  const minutes = "00" + props.date.getMinutes();
  let text =
    props.name + " om " + props.date.getHours() + ":" + minutes.slice(-2);

  const date =
    props.date.getFullYear() +
    "-" +
    props.date.getMonth() +
    "-" +
    props.date.getDate();
  const hour = ("0" + props.date.getHours()).slice(-2);
  const time = hour + ":" + props.date.getMinutes();

  return (
    <div className={classes.CardDiv}>
      {!aanpassen && (
        <>
          <h4>{text}</h4>
          {!auth.admin && (
            <UserBtn
              value={value}
              changeValueHandler={changeValueHandler}
              changeState={changeState}
            />
          )}
          <Button small btnType="link">
            Bekijk aanwezigheden
          </Button>
          {auth.admin && (
            <AdminBtn aanpassenClicked={() => setAanpassen(true)} />
          )}
        </>
      )}
      {aanpassen && (
        <EventShow
          method="patch"
          initialValue={{
            id: props.id,
            name: props.name,
            date,
            time,
          }}
          succes={eventUpdatedHandler}
        />
      )}
    </div>
  );
};

export default Card;
