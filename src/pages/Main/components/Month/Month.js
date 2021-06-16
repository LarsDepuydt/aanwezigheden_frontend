import Datum from "../Datum/Datum";

import classes from "./Month.module.scss";

const maandtext = (month) => {
  switch (month) {
    case "0":
      return "Januari";
    case "1":
      return "Februari";
    case "2":
      return "Maart";
    case "3":
      return "April";
    case "4":
      return "Mei";
    case "5":
      return "Juni";
    case "6":
      return "Juli";
    case "7":
      return "Augustus";
    case "8":
      return "September";
    case "9":
      return "Oktober";
    case "10":
      return "November";
    case "11":
      return "December";
    default:
      return "";
  }
};

const Month = (props) => {
  let events;
  if (props.events.length !== 0) {
    events = props.events.map((event) => (
      <Datum
        key={event._id}
        event={event}
        changeValue={(v, id) =>
          props.changeValue(
            v,
            id,
            props.events.indexOf(event),
            props.monthNumber
          )
        }
        changeValueHandler={(id) =>
          props.changeValueHandler(
            id,
            props.events.indexOf(event),
            props.monthNumber
          )
        }
        eventUpdated={(obj, id) =>
          props.eventUpdated(
            obj,
            id,
            props.events.indexOf(event),
            props.monthNumber
          )
        }
        eventDeleted={(id) =>
          props.eventDeleted(id, props.events.indexOf(event), props.monthNumber)
        }
      />
    ));
  }

  return (
    <div className={classes.MonthDiv}>
      <h3 className={classes.h3}>{maandtext(props.monthNumber)}</h3>
      {events}
    </div>
  );
};

export default Month;
