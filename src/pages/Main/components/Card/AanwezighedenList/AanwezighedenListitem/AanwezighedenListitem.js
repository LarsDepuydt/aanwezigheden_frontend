import classes from "./AanwezighedenListItem.module.scss";

const AanwezighedenListitem = (props) => {
  return <li className={classes.ListItem}>{props.text}</li>;
};

export default AanwezighedenListitem;
