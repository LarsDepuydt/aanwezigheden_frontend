import { useContext, useState } from "react";
import { AuthContext } from "../../../../shared/hooks/auth-context";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import UserBtn from "./UserBtn/UserBtn";
import AdminBtn from "./AdminBtn/AdminBtn";
import EventShow from "../../../Admin/components/EventShow/EventShow";
import AanwezighedenList from "./AanwezighedenList/AanwezighedenList";
import Button from "../../../../shared/components/UI/Button/Button";
import Spinner from "../../../../shared/components/HttpHandling/Spinners/LoadingSpinnerCenter/LoadingSpinnerCenter";
import PageError from "../../../../shared/components/HttpHandling/PageError/PageError";

import classes from "./Card.module.scss";

// 0: aanwezig
// 1: afwezig
// 2: onbepaald

const Card = (props) => {
  const value = props.state;
  const auth = useContext(AuthContext);
  const [aanpassen, setAanpassen] = useState(false);
  const [allAanwezigheden, setAllAanwezigheden] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const eventUpdatedHandler = (newValues) => {
    props.eventUpdated(newValues);
    setAanpassen(false);
  };

  const getAllAanwezighedenHandler = async () => {
    if (!allAanwezigheden) {
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/event/aanwezigheden/" + props.id,
          "get",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        setAllAanwezigheden(response.event);
      } catch (err) {}
    } else {
      setAllAanwezigheden(false);
    }
  };

  const retryAanwezighedenHandler = () => {
    clearError();
    setAllAanwezigheden(false);
    getAllAanwezighedenHandler();
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
              changeValueHandler={props.changeValueHandler}
              changeValue={props.changeValue}
            />
          )}
          {!error && (
            <Button small btnType="link" clicked={getAllAanwezighedenHandler}>
              {!allAanwezigheden
                ? "Bekijk aanwezigheden"
                : "Verberg aanwezigheden"}
            </Button>
          )}
          {allAanwezigheden && !isLoading && !error && (
            <AanwezighedenList allAanwezigheden={allAanwezigheden} />
          )}
          {error && !isLoading && (
            <PageError
              error={error}
              clicked={retryAanwezighedenHandler}
              btnText="Probeer opnieuw"
            />
          )}
          {isLoading && <Spinner />}
          {auth.admin && (
            <AdminBtn
              aanpassenClicked={() => setAanpassen(true)}
              deleteClicked={props.eventDeleted}
            />
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
