import classes from "./Arrow.module.scss";

const Arrow = (props) => {
  return (
    <button className={classes.arrowDiv} onClick={props.clicked}>
      Vandaag
    </button>
  );
};

export default Arrow;
