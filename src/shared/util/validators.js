const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
const VALIDATOR_TYPE_NUMBER = "NUMBER";
const VALIDATOR_TYPE_MINLENGTH = "MINNUMBER";
const VALIDATOR_TYPE_DATE = "DATE";
const VALIDATOR_TYPE_HOUR = "HOUR";

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_NUMBER = () => ({ type: VALIDATOR_TYPE_NUMBER });
export const VALIDATOR_MINLENGTH = (value) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  minLength: value,
});
export const VALIDATOR_DATE = () => ({ type: VALIDATOR_TYPE_DATE });
export const VALIDATOR_HOUR = () => ({ type: VALIDATOR_TYPE_HOUR });

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      if (value !== undefined) {
        isValid = isValid && value.trim().length > 0;
      } else {
        isValid = false;
      }
    }
    if (validator.type === VALIDATOR_TYPE_NUMBER) {
      isValid = isValid && !isNaN(value);
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.minLength;
    }
    if (validator.type === VALIDATOR_TYPE_DATE) {
      const checkDate = new RegExp(
        "^(\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\\d|30|31))$"
      );
      isValid = isValid && checkDate.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_HOUR) {
      const checkHour = new RegExp("^(([0-1]\\d|2[0-3]):([0-5]\\d))$");
      isValid = isValid && checkHour.test(value);
    }
  }
  return isValid;
};
