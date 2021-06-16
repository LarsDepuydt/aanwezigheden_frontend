import Button from "../../../../../shared/components/UI/Button/Button";
import { ReactComponent as Delete } from "../../../../../assets/icons/noun_Delete_742296.svg";
import { ReactComponent as Edit } from "../../../../../assets/icons/noun_edit_3874020.svg";

import classes from "./AdminBtn.module.scss";

const AdminBtn = (props) => {
  return (
    <div className={classes.adminBtnDiv}>
      <Button small edit btnType="svg" clicked={props.aanpassenClicked}>
        <div className={classes.svgDiv}>
          <Edit />
        </div>
      </Button>
      <Button small delete btnType="svg" clicked={props.deleteClicked}>
        <div className={classes.svgDiv}>
          <Delete />
        </div>
      </Button>
    </div>
  );
};

export default AdminBtn;
