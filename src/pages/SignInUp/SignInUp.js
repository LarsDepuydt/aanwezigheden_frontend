import { useState, useReducer, useCallback, useRef, useContext } from "react";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { updateObject } from "../../shared/util/utility";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../../shared/hooks/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Input from "../../shared/components/UI/InputWithState/InputWithState";
import Button from "../../shared/components/UI/Button/Button";
import yearOptions from "./chooseOptions/chooseOptions";
import LoadingSpinner from "../../shared/components/HttpHandling/Spinners/LoadingSpinnerOverlay/LoadingSpinnerOverlay";

import classes from "./SignInUp.module.scss";

const signinReducer = (state, action) => {
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

const SignUp = (props) => {
  const [signinInfo, dispatch] = useReducer(signinReducer, {
    voornaam: { value: "", isValid: false },
    achternaam: { value: "", isValid: false },
    geboortejaar: { value: yearOptions[0], isValid: true },
    password: { value: "", isValid: false },
    isValid: false,
  });
  const { signIn } = props;
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

    error && clearError();
  };

  const geboortejaarChangeHandler = useCallback((value, isValid) => {
    stateChangeHandler("geboortejaar", value, isValid);
    // eslint-disable-next-line
  }, []);

  const history = useHistory();
  const params = useParams();

  const changeSignInHandler = (event) => {
    event.preventDefault();
    if (signIn) {
      history.push("/" + params.verenigingNaam + "/registreren");
    } else {
      history.push("/" + params.verenigingNaam + "/inloggen");
    }
  };

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const buttonClickedHandler = async (event) => {
    event.preventDefault();
    if (signinInfo.isValid) {
      const username =
        signinInfo.voornaam.value + " " + signinInfo.achternaam.value;
      const vname = params.verenigingNaam;

      if (signIn) {
        try {
          const responseData = await sendRequest(
            `api/users/${vname}/login`,
            "patch",
            {
              username,
              password: signinInfo.password.value,
            }
          );
          auth.login(
            responseData.userId,
            responseData.token,
            responseData.admin,
            vname
          );
        } catch (err) {}
      } else {
        try {
          const responseData = await sendRequest(
            `api/users/${vname}/signup`,
            "post",
            {
              username,
              password: signinInfo.password.value,
              geboortejaar: signinInfo.geboortejaar.value,
              roleLeiding: true,
            }
          );
          auth.login(
            responseData.userId,
            responseData.token,
            responseData.admin,
            vname
          );
        } catch (err) {}
      }
      history.push("/" + vname);
    } else {
      setTouchedState(true);
      if (!signinInfo.voornaam.isValid) {
        ref1.current.focus();
      } else if (!signinInfo.achternaam.isValid) {
        ref2.current.focus();
      } else if (!signinInfo.password.isValid) {
        ref3.current.focus();
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <form className={classes.signupDiv}>
        <h2>{signIn ? "Log in" : "Maak je account"}</h2>
        <div className={classes.naamDiv}>
          <div className={classes.halfDiv}>
            <Input
              type="text"
              onInput={useCallback(
                (value, isValid) =>
                  stateChangeHandler("voornaam", value, isValid),
                // eslint-disable-next-line
                []
              )}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage="Geef een voornaam in"
              autoFocus
              childRef={ref1}
              {...(touchedState && { touched: true })}
            >
              Voornaam
            </Input>
          </div>
          <div className={classes.halfDiv}>
            <Input
              type="text"
              onInput={useCallback(
                (value, isValid) =>
                  stateChangeHandler("achternaam", value, isValid),
                // eslint-disable-next-line
                []
              )}
              validators={[VALIDATOR_REQUIRE()]}
              errorMessage="Geef een achternaam in"
              childRef={ref2}
              {...(touchedState && { touched: true })}
            >
              Achternaam
            </Input>
          </div>
        </div>
        {!signIn && (
          <Input
            type="select"
            onInput={geboortejaarChangeHandler}
            validators={[]}
            options={yearOptions}
            initialValue={signinInfo.geboortejaar.value}
            touched
          >
            Geboortejaar
          </Input>
        )}
        <Input
          type="password"
          onInput={useCallback(
            (value, isValid) => stateChangeHandler("password", value, isValid),
            // eslint-disable-next-line
            []
          )}
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
          errorMessage="Kies een wachtwoord van minstens 6 tekens"
          {...(touchedState && { touched: true })}
          childRef={ref3}
        >
          Wachtwoord
        </Input>
        <div className={classes.buttonMargin}>
          <Button
            clicked={buttonClickedHandler}
            btnType="primary"
            disabledS={!signinInfo.isValid}
          >
            {signIn ? "Inloggen" : "Registreren"}
          </Button>
        </div>
        {error !== "" && <p className={classes.error}>{error}</p>}
        <Button clicked={changeSignInHandler} small btnType={"link"}>
          {signIn ? "Nog geen account?" : "Al een account?"}
        </Button>
      </form>
    </>
  );
};

export default SignUp;
