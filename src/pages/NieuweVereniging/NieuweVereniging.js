import { useState, useReducer, useCallback, useRef, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { updateObject } from "../../shared/util/utility";
import { AuthContext } from "../../shared/hooks/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Input from "../../shared/components/UI/InputWithState/InputWithState";
import Button from "../../shared/components/UI/Button/Button";
import LoadingSpinner from "../../shared/components/HttpHandling/Spinners/LoadingSpinnerOverlay/LoadingSpinnerOverlay";

import classes from "./NieuweVereniging.module.scss";

const verenigingReducer = (state, action) => {
  switch (action.type) {
    case "CHECK_VALID":
      const isValid =
        state.voornaam.isValid &&
        state.achternaam.isValid &&
        state.password.isValid;
      return updateObject(state, { isValid: isValid });
    case "UPDATE_ELEMENT":
      return updateObject(state, {
        [action.stateName]: { value: action.value, isValid: action.isValid },
      });
    default:
      return state;
  }
};

const NieuweVeringing = () => {
  const [vereniginInfo, dispatch] = useReducer(verenigingReducer, {
    naamVereniging: { value: "", isValid: false },
    voornaam: { value: "", isValid: false },
    achternaam: { value: "", isValid: false },
    password: { value: "", isValid: false },
    isValid: false,
  });
  const [touchedState, setTouchedState] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const stateChangeHandler = (stateName, value, isValid) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      stateName,
      value,
      isValid,
    });
    dispatch({
      type: "CHECK_VALID",
    });
    clearError();
  };

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const history = useHistory();
  const { verenigingNaam } = useParams();

  const buttonClickedHandler = async (event) => {
    event.preventDefault();
    if (vereniginInfo.isValid) {
      const username =
        vereniginInfo.voornaam.value + " " + vereniginInfo.achternaam.value;

      try {
        const responseData = await sendRequest("api/vereniging", "post", {
          name: vereniginInfo.naamVereniging.value,
          username,
          password: vereniginInfo.password.value,
        });
        auth.login(responseData.userId, responseData.token);
        history.push("/" + verenigingNaam);
      } catch (err) {}
    } else {
      setTouchedState(true);
      if (!vereniginInfo.naamVereniging.isValid) {
        ref1.current.focus();
      } else if (!vereniginInfo.voornaam.isValid) {
        ref2.current.focus();
      } else if (!vereniginInfo.achternaam.isValid) {
        ref3.current.focus();
      } else if (!vereniginInfo.password.isValid) {
        ref4.current.focus();
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <form className={classes.verenigingDiv}>
        <h2>Maak een nieuwe vereniging</h2>
        <Input
          type={"text"}
          onInput={useCallback(
            (value, isValid) =>
              stateChangeHandler("naamVereniging", value, isValid),
            // eslint-disable-next-line
            []
          )}
          validators={[VALIDATOR_REQUIRE()]}
          errorMessage={"Geef de naam van je vereniging in"}
          {...(touchedState && { touched: true })}
          autoFocus
          childRef={ref1}
        >
          Naam vereniging
        </Input>
        <div className={classes.naamDiv}>
          <div className={classes.halfDiv}>
            <Input
              type={"text"}
              onInput={useCallback(
                (value, isValid) =>
                  stateChangeHandler("voornaam", value, isValid),
                // eslint-disable-next-line
                []
              )}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage={"Geef een voornaam in"}
              childRef={ref2}
              {...(touchedState && { touched: true })}
            >
              Voornaam
            </Input>
          </div>
          <div className={classes.halfDiv}>
            <Input
              type={"text"}
              onInput={useCallback(
                (value, isValid) =>
                  stateChangeHandler("achternaam", value, isValid),
                // eslint-disable-next-line
                []
              )}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage={"Geef een achternaam in"}
              childRef={ref3}
              {...(touchedState && { touched: true })}
            >
              Achternaam
            </Input>
          </div>
        </div>
        <Input
          type={"password"}
          onInput={useCallback(
            (value, isValid) => stateChangeHandler("password", value, isValid),
            // eslint-disable-next-line
            []
          )}
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
          errorMessage={"Kies een wachtwoord van minstens 6 tekens"}
          {...(touchedState && { touched: true })}
          childRef={ref4}
        >
          Wachtwoord
        </Input>
        <div className={classes.buttonMargin}>
          <Button
            clicked={buttonClickedHandler}
            btnType={"primary"}
            disabledS={!vereniginInfo.isValid}
          >
            Maak vereniging
          </Button>
        </div>
        {error !== "" && <p className={classes.error}>{error}</p>}
      </form>
    </>
  );
};

export default NieuweVeringing;
