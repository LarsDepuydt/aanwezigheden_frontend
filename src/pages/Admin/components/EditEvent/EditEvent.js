import EventShow from "../EventShow/EventShow";

const EditEvent = (props) => {
  const { dateObj } = props;

  const date =
    dateObj.getFullYear() + "-" + dateObj.getMonth() + "-" + dateObj.getDate();
  const hour = ("0" + dateObj.getHours()).slice(-2);
  const time = hour + ":" + dateObj.getMinutes();

  const values = {
    id: props.id,
    name: props.name,
    date,
    time,
  };

  return (
    <EventShow method="patch" initialValue={values} succes={props.succes} />
  );
};

export default EditEvent;
