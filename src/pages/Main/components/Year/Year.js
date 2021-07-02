import Month from "../Month/Month";
import classes from "./Year.module.scss";

const Year = (props) => {
  const nextYear = new Date(parseInt(props.year) + 1, 0, 1);
  const today = new Date();
  let past;
  nextYear <= today ? (past = true) : (past = false);

  let months;
  if (props.months.length !== 0) {
    const keys = Object.keys(props.months);
    months = keys.map((month, index) => (
      <Month
        key={props.year + "-" + month}
        year={props.year}
        monthNumber={month}
        events={props.months[month]}
        focusedEvent={props.focusedEvent}
        vandaag={props.vandaag}
        changeValue={(v, id, n, m) =>
          props.changeValue(v, id, n, m, props.year)
        }
        changeValueHandler={(id, n, m) =>
          props.changeValueHandler(id, n, m, props.year)
        }
        eventUpdated={(obj, id, n, m) =>
          props.eventUpdated(obj, id, n, m, props.year)
        }
        eventDeleted={(id, n, m) => props.eventDeleted(id, n, m, props.year)}
        getAllAanwezigheden={(show, id, n, m) =>
          props.getAllAanwezigheden(show, id, n, m, props.year)
        }
      />
    ));
  }
  return (
    <div className={[past && classes.past].join(" ")}>
      <h3>{props.year}</h3>
      {months}
    </div>
  );
};

export default Year;
