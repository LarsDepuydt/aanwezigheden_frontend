import Card from "../Card/Card";

import classes from "./Datum.module.scss";

const getDay = (date) => {
  const day = date.getDay();

  switch (day) {
    case 0:
      return "zo";
    case 1:
      return "ma";
    case 2:
      return "di";
    case 3:
      return "woe";
    case 4:
      return "do";
    case 5:
      return "vr";
    case 6:
      return "za";
    default:
      return "";
  }
};

const Datum = (props) => {
  const { event } = props;
  const id = event._id;

  return (
    <div className={classes.DatumDiv}>
      <div>
        <p className={classes.day}>{getDay(event.date)}</p>
        <p className={classes.date}>{event.date.getDate()}</p>
      </div>
      <Card
        id={id}
        name={event.name}
        date={event.date}
        state={event.state}
        changeState={(value) => props.changeState(value, id)}
        eventUpdated={(obj) => props.eventUpdated(obj, id)}
      />
    </div>
  );
};

export default Datum;
