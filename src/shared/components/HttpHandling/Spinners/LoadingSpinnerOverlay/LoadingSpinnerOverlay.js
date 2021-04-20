import ReactDOM from "react-dom";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Backdrop from "../../../UI/Backdrop/Backdrop";

import classes from "./LoadingSpinnerOverlay.module.scss";

const LoadingSpinnerOverlay = (props) => {
  return ReactDOM.createPortal(
    <>
      <Backdrop />
      <div className={classes.loadingDiv}>
        <LoadingSpinner backdrop />
      </div>
    </>,
    document.getElementById("loading-hook")
  );
};

export default LoadingSpinnerOverlay;
