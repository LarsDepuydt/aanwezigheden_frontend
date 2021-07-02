import Button from "../../../../shared/components/UI/Button/Button";
import classes from "./GeenEvents.module.scss";

const GeenEvents = (props) => {
  return (
    <>
      <p className={classes.topP}>
        Er zijn nog geen evenementen aangemaakt door je vereniging
      </p>
      {props.admin && (
        <Button btnType="secondary" small clicked={props.clicked}>
          Maak een event
        </Button>
      )}
    </>
  );
};

export default GeenEvents;
