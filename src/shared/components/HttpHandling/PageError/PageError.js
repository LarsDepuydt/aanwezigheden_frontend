import Button from "../../UI/Button/Button";
import classes from "./PageError.module.scss";

const PageError = (props) => {
  return (
    <>
      <h3>Oeps, er ging iets fout</h3>
      <p className={classes.errorText}>{props.error}</p>
      {props.btnText && (
        <Button small btnType={"secondary"} clicked={props.clicked}>
          {props.btnText}
        </Button>
      )}
    </>
  );
};

export default PageError;
