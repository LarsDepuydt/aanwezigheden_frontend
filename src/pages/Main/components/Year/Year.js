import Month from "../Month/Month";

const Year = (props) => {
  let months;
  if (props.months.length !== 0) {
    const keys = Object.keys(props.months);
    months = keys.map((month, index) => (
      <Month
        key={props.year + "-" + month}
        year={props.year}
        monthNumber={month}
        events={props.months[month]}
        changeState={(v, id, n, m) =>
          props.changeState(v, id, n, m, props.year)
        }
        eventUpdated={(obj, id, n, m) =>
          props.eventUpdated(obj, id, n, m, props.year)
        }
      />
    ));
  }
  return (
    <>
      <h3>{props.year}</h3>
      {months}
    </>
  );
};

export default Year;
