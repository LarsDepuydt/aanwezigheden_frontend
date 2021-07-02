import { useRef, useEffect } from "react";
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
  const { event, focusedEvent } = props;
  const id = event._id;
  const refFocus = useRef();

  useEffect(() => {
    if (focusedEvent === id) {
      refFocus.current.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "instant",
      });
    }
  }, [focusedEvent, id]);

  useEffect(() => {
    if (focusedEvent === id) {
      refFocus.current.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [focusedEvent, id, props.vandaag]); // zorgt voor de terug naar vandaag knop

  return (
    <div className={[classes.DatumDiv, event.past && classes.past].join(" ")}>
      <div ref={refFocus}>
        <p className={classes.day}>{getDay(event.date)}</p>
        <p className={classes.date}>{event.date.getDate()}</p>
      </div>
      <Card
        id={id}
        name={event.name}
        date={event.date}
        state={event.state}
        past={event.past}
        allAanwezigheden={event.allAanwezigheden}
        changeValue={(value) => props.changeValue(value, id)}
        changeValueHandler={() => props.changeValueHandler(id)}
        eventUpdated={(obj) => props.eventUpdated(obj, id)}
        eventDeleted={() => props.eventDeleted(id)}
        getAllAanwezigheden={(show) => props.getAllAanwezigheden(show, id)}
      />
    </div>
  );
};

export default Datum;
