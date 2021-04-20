import { useState } from "react";

import { ReactComponent as Check } from "../../../../../assets/icons/noun_check_1388035.svg";
import { ReactComponent as Cross } from "../../../../../assets/icons/noun_cross_3077578.svg";
import { ReactComponent as Arrow } from "../../../../../assets/icons/noun_down_3456470.svg";

import classes from "./Status.module.scss";

const Status = (props) => {
  const [hover, setHover] = useState(false);

  let text;
  let icon;
  let style = [classes.StatusDiv];

  switch (props.value) {
    case 1:
      text = "aanwezig";
      icon = <Check />;
      style.push(classes.green);
      break;
    case 0:
      text = "afwezig";
      icon = <Cross />;
      style.push(classes.red);
      break;
    default:
      text = "er ging iets mis";
  }

  return (
    <div
      className={style.join(" ")}
      onClick={props.clicked}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={classes.BolDiv}>{icon}</div>
      <p className={classes.label}>{text}</p>
      <div className={classes.BolDiv2}>{hover && <Arrow />}</div>
      {hover && <p className={classes.change}>aanpassen</p>}
    </div>
  );
};

export default Status;
