import Button from "../../../../../shared/components/UI/Button/Button";
import Status from "../Status/Status";

import classes from "./UserBtn.module.scss";

const UserBtn = (props) => {
  const { value } = props;

  return (
    <>
      {value !== 2 && (
        <Status value={value} clicked={props.changeValueHandler} />
      )}
      {value === 2 && (
        <div className={classes.BtnDiv}>
          <Button btnType={"positive"} clicked={() => props.changeValue(1)}>
            Aanwezig
          </Button>
          <Button btnType={"negative"} clicked={() => props.changeValue(0)}>
            Afwezig
          </Button>
        </div>
      )}
    </>
  );
};

export default UserBtn;
