import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/hooks/auth-context";
import { sortArrayByDate } from "../../shared/util/sortArrayByDate";

import Year from "./components/Year/Year";
import Spinner from "../../shared/components/HttpHandling/Spinners/LoadingSpinnerCenter/LoadingSpinnerCenter";
import PageError from "../../shared/components/HttpHandling/PageError/PageError";

const Main = () => {
  const [events, setEvents] = useState([]);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const { token } = auth;
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
            eventsArray.push(event);
          }
        }
        if (responseData.events.afwezig.length !== 0) {
          for (const event of responseData.events.afwezig) {
            event.state = 0;
            event.touched = false;
            eventsArray.push(event);
          }
        }
        if (responseData.events.onbepaald.length !== 0) {
          for (const event of responseData.events.onbepaald) {
            event.state = 2;
            event.touched = false;
            eventsArray.push(event);
          }
        }

        const eventsSorted = sortArrayByDate(eventsArray);
        setEvents(eventsSorted);
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest, token]);

  const cardStateChangeHandler = (value, id, number, month, year) => {
    if (events[year][month][number].value !== value) {
      const newEvent = {
        ...events[year][month][number],
        touched: true,
        state: value,
      };

      const newMonthArray = events[year][month];
      newMonthArray[number] = newEvent;
      const newEvents = {
        ...events,
        [year]: { ...events[year], [month]: newMonthArray },
      };
      setEvents(newEvents);

      let name;
      if (value === 1) {
        name = "aanwezig";
      } else {
        name = "afwezig";
      }

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

  const eventUpdatedHandler = (obj, id, number, month, year) => {
    const newEvents = { ...events };
    newEvents[year][month][number].name = obj.name;

    if (obj.date.getYear() === newEvents[year][month])
      for (const event of newEvents[year][month]) {
        if (event.id === id) {
          newEvents[year][month].pull(event);
        }
      }

    console.log(newEvents);
    //setEvents(newEvents);
  };

  const history = useHistory();
  const reloadPageHandler = () => {
    clearError();
    history.push(0);
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
        <p>Er zijn nog geen evenementen aangemaakt door je vereniging</p>
      ) : (
        years
      )}
    </>
  );
};

export default Main;
