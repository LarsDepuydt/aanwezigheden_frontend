import { useReducer, useCallback, useContext, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_DATE,
  VALIDATOR_HOUR,
} from "../../../../shared/util/validators";
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { AuthContext } from "../../../../shared/hooks/auth-context";
import { updateObject } from "../../../../shared/util/utility";

import Input from "../../../../shared/components/UI/InputWithState/InputWithState";
import Button from "../../../../shared/components/UI/Button/Button";
import LoadingSpinner from "../../../../shared/components/HttpHandling/Spinners/LoadingSpinnerCenter/LoadingSpinnerCenter";
import classes from "./EventShow.module.scss";

const initialState = {
  name: { value: "", isValid: false },
  date: { value: "", isValid: false },
  time: { value: "", isValid: false },
  isValid: false,
};

const eventReducer = (state, action) => {
  switch (action.type) {
    case "STATE_CHANGE":
      return updateObject(state, {
        [action.stateName]: { value: action.value, isValid: action.isValid },
      });
    case "CHECK_VALID":
      const isValid =
        state.name.isValid && state.date.isValid && state.time.isValid;
      return updateObject(state, { isValid: isValid });
    case "CLEAR_STATE":
      return initialState;
    default:
      return state;
  }
};

// method, defaultvalues, isLoading, error, clearError
const EventShow = (props) => {
  const [eventState, dispatch] = useReducer(eventReducer, initialState);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [eventCreated, setEventCreated] = useState(false);
  const [touchedState, setTouchedState] = useState(false);
  const history = useHistory();

  const stateChangeHandler = (stateName, value, isValid) => {
    dispatch({ type: "STATE_CHANGE", stateName, value, isValid });
    dispatch({ type: "CHECK_VALID" });

    error && clearError();
  };

  // handels form state changes
  const nameChangeHandler = useCallback((value, isValid) => {
    stateChangeHandler("name", value, isValid);
    // eslint-disable-next-line
  }, []);
  const dateChangeHandler = useCallback((value, isValid) => {
    stateChangeHandler("date", value, isValid);
    // eslint-disable-next-line
  }, []);
  const timeChangeHandler = useCallback((value, isValid) => {
    stateChangeHandler("time", value, isValid);
    // eslint-disable-next-line
  }, []);

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const btnClickedHandler = async (event) => {
    event.preventDefault();

    if (eventState.isValid) {
      const dateArray = eventState.date.value.split("-");
      const timeArray = eventState.time.value.split(":");
      const dateObj = new Date(
        dateArray[0],
        dateArray[1],
        dateArray[2],
        timeArray[0],
        timeArray[1]
      );

      if (props.method === "post") {
        try {
          await sendRequest(
            "/api/event",
            "post",
            {
              name: eventState.name.value,
              date: dateObj,
            },
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          setEventCreated(true);
        } catch (err) {}
      } else {
        props.succes({ name: eventState.name.value, date: dateObj });
      }
    } else {
      setTouchedState(true);
      if (!eventState.name.isValid) {
        ref1.current.focus();
      } else if (!eventState.date.isValid) {
        ref2.current.focus();
      } else if (!eventState.time.isValid) {
        ref3.current.focus();
      }
    }
  };

  const nieuwEventHandler = () => {
    dispatch({ type: "CLEAR_STATE" });
    setEventCreated(false);
  };

  const backToMainHandler = () => {
    history.push("/" + auth.vereniging);
  };

  let headerText;
  let btnText;
  if (props.method === "post") {
    headerText = "Maak een nieuw event";
    btnText = "Maak event";
    if (isLoading) {
      headerText = "Event wordt gecreëerd";
    }
    if (eventCreated) {
      headerText = "Event gecreëerd";
    }
  } else if (props.method === "patch") {
    headerText = "Event aanpassen";
    btnText = "Opslagen";
    if (isLoading) {
      headerText = "Event wordt aangepast";
    }
    if (eventCreated) {
      headerText = "Event aangepast";
    }
  }

  return (
    <form className={[props.method === "post" && classes.EventDiv].join(" ")}>
      <h2
        className={[
          classes.h2,
          props.method === "patch" && classes.h2Small,
        ].join(" ")}
      >
        {headerText}
      </h2>
      {!eventCreated && !isLoading && !props.isLoading && (
        <>
          <Input
            type="text"
            onInput={nameChangeHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorMessage="Geef een eventnaam in"
            autoFocus
            childRef={ref1}
            initialValue={props.initialValue.name}
            {...(touchedState && { touched: true })}
          >
            Naam event
          </Input>
          <div className={classes.timeDiv}>
            <div className={classes.dateDiv}>
              <Input
                type="date"
                onInput={dateChangeHandler}
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_DATE()]}
                errorMessage="Geen geldige datum"
                center
                childRef={ref2}
                initialValue={props.initialValue.date}
                {...(touchedState && { touched: true })}
              >
                Datum event
              </Input>
            </div>
            <div className={classes.hourDiv}>
              <Input
                type="time"
                onInput={timeChangeHandler}
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_HOUR()]}
                errorMessage="Geen geldig tijdstip"
                center
                childRef={ref3}
                initialValue={props.initialValue.time}
                {...(touchedState && { touched: true })}
              >
                Uur event
              </Input>
            </div>
          </div>
          <Button
            btnType="primary"
            small={props.method === "patch"}
            clicked={btnClickedHandler}
            disabledS={!eventState.isValid}
          >
            {btnText}
          </Button>
          {error && <p className={classes.error}>{error}</p>}
        </>
      )}
      {isLoading && <LoadingSpinner />}
      {eventCreated && !isLoading && props.method === "post" && (
        <>
          <Button small btnType="secondary" clicked={nieuwEventHandler}>
            Maak nog een event
          </Button>
          <Button small btnType="secondary" clicked={backToMainHandler}>
            Terug naar overzicht
          </Button>
        </>
      )}
    </form>
  );
};

export default EventShow;
