import { useReducer, useEffect } from "react";
import { updateObject } from "../../../util/utility";
import { validate } from "../../../util/validators";

import Input from "./Input/Input";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return updateObject(state, {
        value: action.value,
        isValid: validate(action.value, action.validators),
        touched: true,
      });
    case "TOUCHED":
      return updateObject(state, {
        touched: true,
      });
    default:
      return state;
  }
};

const InputWithState = (props) => {
  const { validators, initialValue, type } = props;

  let initialState = {
    value: props.initialValue || "",
    touched: props.touched || false,
    isValid: validate(props.initialValue, props.validators),
  };
  if (type === "date" && initialValue !== undefined) {
    const curr = new Date(initialValue);
    const initialValue_new = curr.toISOString().substr(0, 10);

    initialState = {
      value: initialValue_new,
      touched: props.touched || false,
      isValid: validate(initialValue_new, validators),
    };
  }

  if (type === "time" && initialValue !== undefined) {
    const splitted = initialValue.split(":");
    const hour = ("0" + splitted[0]).slice(-2);
    const minutes = ("0" + splitted[1]).slice(-2);
    const initialValue_new = hour + ":" + minutes;

    initialState = {
      value: initialValue_new,
      touched: props.touched || false,
      isValid: validate(initialValue_new, validators),
    };
  }

  const [inputState, dispatch] = useReducer(inputReducer, initialState);

  const { onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(value, isValid);
  }, [onInput, value, isValid]);

  const inputChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  };

  return (
    <Input
      value={inputState.value}
      isValid={inputState.isValid}
      touched={inputState.touched}
      change={inputChangeHandler}
      {...props}
    >
      {props.children}
    </Input>
  );
};

export default InputWithState;
