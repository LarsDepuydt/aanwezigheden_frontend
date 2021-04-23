import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useEventsSort } from "../../shared/hooks/events-hook";
import { AuthContext } from "../../shared/hooks/auth-context";

import Year from "./components/Year/Year";
import Spinner from "../../shared/components/HttpHandling/Spinners/LoadingSpinnerCenter/LoadingSpinnerCenter";
import PageError from "../../shared/components/HttpHandling/PageError/PageError";
import Button from "../../shared/components/UI/Button/Button";

const Main = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const {
    events,
    sortArrayByDate,
    resortOneDateArray,
    updateCardInfo,
  } = useEventsSort();

  const { token, vereniging } = auth;
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest(`api/event`, "get", null, {
          Authorization: `Bearer ${token}`,
        });

        const eventsArray = [];
        if (responseData.events.aanwezig.length !== 0) {
          for (const event of responseData.events.aanwezig) {
            event.state = 1;
            event.touched = false;
            const today = new Date();
            if (today > event.date) {
              event.past = false;
            } else {
              event.past = true;
            }
            eventsArray.push(event);
          }
        }
        if (responseData.events.afwezig.length !== 0) {
          for (const event of responseData.events.afwezig) {
            event.state = 0;
            event.touched = false;
            const today = new Date();
            if (today > event.date) {
              event.past = false;
            } else {
              event.past = true;
            }
            eventsArray.push(event);
          }
        }
        if (responseData.events.onbepaald.length !== 0) {
          for (const event of responseData.events.onbepaald) {
            event.state = 2;
            event.touched = false;
            const today = new Date();
            if (today > event.date) {
              event.past = false;
            } else {
              event.past = true;
            }
            eventsArray.push(event);
          }
        }

        sortArrayByDate(eventsArray, {});
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest, token, vereniging]);

  const cardStateChangeHandler = (value, id, number, month, year) => {
    if (events[year][month][number].value !== value) {
      updateCardInfo(value, year, month, number);

      let name;
      value === 1 ? (name = "aanwezig") : (name = "afwezig");
      sendUpdateRequestHandler(name, [id]);
    }
  };

  const sendUpdateRequestHandler = async (name, idList) => {
    try {
      await sendRequest(
        `http://localhost:5000/api/users`,
        "PATCH",
        {
          [name]: idList,
        },
        {
          Authorization: "Bearer " + token,
        }
      );
    } catch (err) {}
  };

  const eventUpdatedHandler = async (obj, id, number, month, year) => {
    const response = resortOneDateArray(obj, year, month, number);

    if (response) {
      try {
        await sendRequest(
          "/api/event/" + id,
          "patch",
          {
            name: obj.name,
            date: obj.date,
          },
          {
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {}
    }
  };

  const history = useHistory();
  const reloadPageHandler = () => {
    clearError();
    history.push(0);
  };

  const newEventClickedHandler = () => {
    const old = history.location.pathname;
    history.push(old + "/nieuw-event");
  };

  let years;
  if (events.length !== 0) {
    const keys = Object.keys(events);
    years = keys.map((year, index) => (
      <Year
        key={year}
        year={year}
        months={events[year]}
        changeState={cardStateChangeHandler}
        eventUpdated={eventUpdatedHandler}
      />
    ));
  }

  return (
    <>
      {isLoading && !years && (
        <>
          <Spinner />
          <p>Even geduld, uw evenementen worden geladen</p>
        </>
      )}
      {error && !isLoading && !years && (
        <PageError
          error={error}
          clicked={reloadPageHandler}
          btnText="Probeer opnieuw"
        />
      )}
      {!isLoading && years && years.length === 0 ? (
        <>
          <p>Er zijn nog geen evenementen aangemaakt door je vereniging</p>
          {auth.admin && (
            <Button btnType="secondary" small clicked={newEventClickedHandler}>
              Maak een event
            </Button>
          )}
        </>
      ) : (
        years
      )}
    </>
  );
};

export default Main;
