import classes from "./Input.module.scss";

const Input = (props) => {
  let input;
  if (props.type !== "select") {
    input = (
      <input
        className={[
          classes.Input,
          !props.isValid && props.touched && classes.Invalid,
          props.center && classes.center,
        ].join(" ")}
        value={props.value}
        onChange={props.change}
        type={props.type}
        autoComplete={props.autoComplete}
        autoFocus={props.autoFocus}
        ref={props.childRef}
      />
    );
  } else {
    const options = props.options.map((item) => (
      <option key={item.value} value={item.value}>
        {item.text}
      </option>
    ));
    input = (
      <select
        onChange={props.change}
        value={props.value}
        className={[classes.Input, classes.select].join(" ")}
      >
        {options}
      </select>
    );
  }

  return (
    <>
      <label className={classes.Label}>{props.children}</label>
      {input}
      <p
        className={[
          classes.errorMessage,
          props.hideError && classes.notShow,
        ].join(" ")}
      >
        {!props.isValid && props.touched ? props.errorMessage : ""}
      </p>
    </>
  );
};

export default Input;
