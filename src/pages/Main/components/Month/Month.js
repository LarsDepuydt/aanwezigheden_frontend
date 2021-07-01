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
  const firstNextMonth = new Date(
    props.year,
    parseInt(props.monthNumber) + 1,
    1
  );
  const today = new Date();
  let past;
  firstNextMonth <= today ? (past = true) : (past = false);

  let events;
  if (props.events.length !== 0) {
    events = props.events.map((event, i) => (
      <Datum
        key={event._id}
        event={event}
        focusedEvent={props.focusedEvent}
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
        getAllAanwezigheden={(show, id) =>
          props.getAllAanwezigheden(
            show,
            id,
            props.events.indexOf(event),
            props.monthNumber
          )
        }
      />
    ));
  }

  return (
    <div className={[classes.MonthDiv, past && classes.past].join(" ")}>
      <h3 className={classes.h3}>{maandtext(props.monthNumber)}</h3>
      {events}
    </div>
  );
};

export default Month;
