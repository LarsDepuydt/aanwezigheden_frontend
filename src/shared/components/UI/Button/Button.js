import classes from "./Button.module.scss";

const button = (props) => {
  return (
    <button
      disabled={props.disabled}
      className={[
        classes.Button,
        !props.disabledS && classes[props.btnType],
        props.disabledS && classes.disabledS,
        props.small && classes.small,
      ].join(" ")}
      onClick={props.clicked}
    >
      {props.children}
    </button>
  );
};

export default button;
