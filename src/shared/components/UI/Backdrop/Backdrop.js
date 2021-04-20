import classes from "./Backdrop.module.scss";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClick}></div>;
};

export default Backdrop;
