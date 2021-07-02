import React, { useEffect, useContext, useState, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useEventsSort } from "../../shared/hooks/events-hook";
import { AuthContext } from "../../shared/hooks/auth-context";

import Year from "./components/Year/Year";
import Spinner from "../../shared/components/HttpHandling/Spinners/LoadingSpinnerCenter/LoadingSpinnerCenter";
import PageError from "../../shared/components/HttpHandling/PageError/PageError";
import GeenEvents from "./components/GeenEvents/GeenEvents";
import Button from "../../shared/components/UI/Button/Button";

const Main = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const {
    events,
    focusedEvent,
    sortArrayByDate,
    resortOneDateArray,
    updateCardInfo,
    deleteCard,
  } = useEventsSort();
  const [vandaagScroll, setVandaagScroll] = useState(false);
  const [showVandaag, setShowVandaag] = useState(false);

  const { token, vereniging } = auth;
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest("api/event", "get", null, {
          Authorization: `Bearer ${token}`,
        });
        const eventsArray = [];
        if (responseData.events.aanwezig.length !== 0) {
          for (const event of responseData.events.aanwezig) {
            event.state = 1;
            const today = new Date();
            if (today.toISOString() < event.date) {
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
            const today = new Date();
            if (today.toISOString() < event.date) {
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
            const today = new Date();
            if (today.toISOString() < event.date) {
              event.past = false;
            } else {
              event.past = true;
            }
            eventsArray.push(event);
          }
        }

        if (isMounted) {
          sortArrayByDate(eventsArray, {});
        }
      } catch (err) {}

      return () => {
        isMounted = false;
      };
    };
    fetchEvents();
  }, [sendRequest, token, vereniging, sortArrayByDate]);

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!showVandaag) {
        setShowVandaag(true);
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener("scroll", handleScroll);
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const cardStateChangeValueHandler = (id, number, month, year) => {
    const oldValue = events[year][month][number].state;

    let newValue = 0;
    if (oldValue === 0) {
      newValue = 1;
    }

    cardStateChangeHandler(newValue, id, number, month, year);
  };

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
        "/api/users",
        "patch",
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
          `/api/event/${id}`,
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

  const eventDeletedHandler = async (id, number, month, year) => {
    try {
      await sendRequest(`/api/event/${id}`, "delete", null, {
        Authorization: "Bearer " + token,
      });

      deleteCard(number, month, year);
    } catch (err) {}
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

  const vandaagClickedHandler = () => {
    if (vandaagScroll) {
      setVandaagScroll(false);
    } else {
      setVandaagScroll(true);
    }

    setShowVandaag(false);
  };

  let years;
  if (Object.keys(events).length > 0) {
    const keys = Object.keys(events);
    years = keys.map((year, i) => (
      <Year
        key={year}
        year={year}
        focusedEvent={focusedEvent}
        months={events[year]}
        vandaag={vandaagScroll}
        changeValue={cardStateChangeHandler}
        changeValueHandler={cardStateChangeValueHandler}
        eventUpdated={eventUpdatedHandler}
        eventDeleted={eventDeletedHandler}
      />
    ));
  }

  return (
    <>
      {showVandaag && (
        <Button small btnType="arrow" clicked={vandaagClickedHandler}>
          Vandaag
        </Button>
      )}
      {isLoading && !error && (
        <>
          <Spinner />
          <p>Even geduld, uw evenementen worden geladen</p>
        </>
      )}
      {error && !isLoading && (
        <PageError
          error={error}
          clicked={reloadPageHandler}
          btnText="Probeer opnieuw"
        />
      )}
      {!isLoading && !error && Object.keys(events).length === 0 && (
        <GeenEvents clicked={newEventClickedHandler} admin={auth.admin} />
      )}
      {!isLoading && !error && years && Object.keys(events).length > 0 && years}
    </>
  );
};

export default Main;
